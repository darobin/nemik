
import keytar from "keytar";
// import GoogleOAuth2 from "google-oauth2-env-vars";
import { getNewToken } from "google-oauth2-env-vars/utils/get-new-token.js";
import getPort from "get-port";
import { google } from 'googleapis';

const scope = [
  "https://www.googleapis.com/auth/documents.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
];
// const tokenName = "GOOGLE_DOCS_TOKEN";
const apisToEnable = ["docs.googleapis.com", "drive.googleapis.com"];

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

async function addGoogleCredentials (service, clientId, clientSecret, token) {
  await addCredentials(service, 'client-id', clientId);
  await addCredentials(service, 'client-secret', clientSecret);
  await storeGoogleToken(service, token);
}

export async function getGoogleCredentials (service) {
  const accounts = {
    token: 'token',
    clientId: 'client-id',
    clientSecret: 'client-secret',
  }
  const ret = {};
  for (const k of Object.keys(accounts)) {
    const creds = await getCredentials(service, accounts[k]);
    if (!creds || !creds.length) return;
    const { password } = creds[0];
    ret[k] = (k === 'token') ? JSON.parse(password) : password;
  }
  return ret;
}

async function storeGoogleToken (service, token) {
  await addCredentials(service, 'token', JSON.stringify(token));
}

export async function generateGoogleToken (service, clientId, clientSecret) {
  const port = await getPort();
  const token = await getNewToken({
    clientId,
    clientSecret,
    scope,
    // tokenName: null, // if you provide this it writes it
    apisToEnable,
    port,
  });
  await addGoogleCredentials(service, clientId, clientSecret, token);
}

export async function googleAuth (service) {
  const { clientId, clientSecret, token } = await getGoogleCredentials(service);
  const auth = new google.auth.OAuth2(clientId, clientSecret);
  auth.setCredentials(token);
  let expired = true;
  if (token.expiry_date) {
    const now = new Date();
    const expiry = new Date(token.expiry_date);
    expired = expiry.getTime() <= now.getTime();
  }
  if (expired) {
    auth.on("tokens", async (refreshedToken) => {
      auth.setCredentials(refreshedToken);
      await storeGoogleToken(service, refreshedToken);
    })
  }
  return auth;
}
