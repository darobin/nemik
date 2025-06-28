
import { access } from 'node:fs/promises';

export default async function canRead (path) {
  try {
    await access(path);
    return true;
  }
  catch (e) {
    return false;
  }
}
