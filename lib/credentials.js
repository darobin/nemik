import { createServer } from 'node:http';
import { platform } from 'node:process';
import keytar from "keytar";
import getPort from "get-port";
import { execa } from 'execa';
import { google } from 'googleapis';

const scope = [
  "https://www.googleapis.com/auth/documents.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
];
const apis = ["docs.googleapis.com", "drive.googleapis.com"];
const enableAPIURL = (api) => `https://console.developers.google.com/apis/api/${api}/overview`;

export async function addCredentials (service, account, password) {
  return keytar.setPassword(service, account, password);
}

export async function getCredentials (service, account) {
  if (account) {
    const password = await keytar.getPassword(service, account);
    if (!password) return [];
    return [{ account, password }];
  }
  return keytar.findCredentials(service);
}

// Returns undefined if there is no client ID/secret. The token may be missing, in which
// case the caller is expected to generate one.
export async function getGoogleCredentials (service) {
  const [clientId, clientSecret, token] = await Promise.all(
    ['client-id', 'client-secret', 'token'].map(async (account) => {
      const creds = await getCredentials(service, account);
      return creds?.[0]?.password;
    })
  );
  if (!clientId || !clientSecret) return;
  return { clientId, clientSecret, token: token ? JSON.parse(token) : undefined };
}

async function storeGoogleToken (service, token) {
  await addCredentials(service, 'token', JSON.stringify(token));
}

export function missingCredentialsError (service) {
  return new Error(
    `No Google credentials found for "${service}". Run:\n  nemik credentials gdoc ${service} <clientId> <clientSecret>`
  );
}

// Runs the browser consent flow, stores everything, and returns the token.
export async function generateGoogleToken (service, clientId, clientSecret) {
  const token = await browserAuthFlow(clientId, clientSecret);
  await addCredentials(service, 'client-id', clientId);
  await addCredentials(service, 'client-secret', clientSecret);
  await storeGoogleToken(service, token);
  return token;
}

// Re-runs the consent flow using the stored client ID/secret.
export async function regenerateGoogleToken (service) {
  const creds = await getGoogleCredentials(service);
  if (!creds) throw missingCredentialsError(service);
  return generateGoogleToken(service, creds.clientId, creds.clientSecret);
}

async function browserAuthFlow (clientId, clientSecret) {
  const port = await getPort();
  const redirectURI = `http://localhost:${port}/callback`;
  const client = new google.auth.OAuth2(clientId, clientSecret, redirectURI);
  const url = client.generateAuthUrl({ access_type: 'offline', scope, prompt: 'consent' });
  const code = await new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const { pathname, searchParams } = new URL(req.url, redirectURI);
      if (pathname !== '/callback') {
        res.statusCode = 404;
        res.end();
        return;
      }
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      res.setHeader('content-type', 'text/plain; charset=utf-8');
      if (code) {
        res.end('nemik is authorised. You can close this tab and go back to your terminal.');
        resolve(code);
      }
      else {
        res.statusCode = 400;
        res.end(`Authorisation failed: ${error || 'no code returned'}`);
        reject(new Error(`Google authorisation failed: ${error || 'no code returned'}`));
      }
      // Don't keep the process alive once we have our answer.
      server.close();
      server.closeAllConnections();
    });
    server.on('error', reject);
    server.listen(port, async () => {
      console.warn(`Authorise nemik in your browser (opening it now, or paste this URL):\n  ${url}`);
      await openInBrowser(url);
    });
  });
  const { tokens } = await client.getToken(code);
  if (!tokens.refresh_token) {
    throw new Error(`Google did not return a refresh token; revoke nemik's access at https://myaccount.google.com/permissions and try again.`);
  }
  return tokens;
}

async function openInBrowser (url) {
  const cmd = platform === 'darwin'
    ? ['open', [url]]
    : platform === 'win32'
      ? ['cmd', ['/c', 'start', '""', url]]
      : ['xdg-open', [url]];
  try {
    await execa(...cmd);
  }
  catch {
    // The URL has already been printed, so the user can open it by hand.
  }
}

// Returns an OAuth2 client that refreshes access tokens on its own, persists refreshed tokens,
// and runs the browser flow if there is no usable token yet.
export async function googleAuth (service) {
  const creds = await getGoogleCredentials(service);
  if (!creds) throw missingCredentialsError(service);
  const { clientId, clientSecret } = creds;
  let { token } = creds;
  if (!token?.refresh_token) {
    console.warn(`No Google token for "${service}", requesting one.`);
    token = await generateGoogleToken(service, clientId, clientSecret);
  }
  const auth = new google.auth.OAuth2(clientId, clientSecret);
  auth.setCredentials(token);
  auth.on("tokens", (refreshed) => {
    // Google only sends the refresh token when it issues a new one, so keep the old one around.
    token = { ...token, ...refreshed };
    storeGoogleToken(service, token).catch((err) => console.warn(`Could not store refreshed Google token: ${err.message}`));
  });
  return auth;
}

// True if the error means our token is no longer usable (as opposed to a bad document ID, a
// network problem, etc.) and running the consent flow again is the fix.
export function isGoogleAuthError (err) {
  const status = err?.status ?? err?.code ?? err?.response?.status;
  if (status === 401) return true;
  const gerr = err?.response?.data?.error;
  if (gerr === 'invalid_grant' || gerr === 'invalid_rapt') return true;
  return /No refresh token is set|invalid_grant|invalid_rapt|Token has been expired or revoked/i.test(err?.message ?? '');
}

// True if the error is Google telling us an API is disabled for this project.
export function isGoogleAPIDisabledError (err) {
  const details = err?.response?.data?.error?.details ?? err?.errors ?? [];
  if (details.some?.((d) => d?.reason === 'SERVICE_DISABLED' || d?.reason === 'accessNotConfigured')) return true;
  return /has not been used in project|is disabled|accessNotConfigured/i.test(err?.message ?? '');
}

export function apiDisabledError (err) {
  const urls = apis.map((api) => `  ${enableAPIURL(api)}`).join('\n');
  return new Error(`A Google API is disabled for this OAuth client's project. Enable these, then run again:\n${urls}\n(${err.message})`);
}
