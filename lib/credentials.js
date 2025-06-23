
import keytar from "keytar";

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

// export async function addCredentials (service, account, password) {
//   return keytar.setPassword(service, account, password);
// }
