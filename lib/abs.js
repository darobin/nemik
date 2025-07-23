
import { isAbsolute, join } from "node:path";
import { cwd } from "node:process";

export default function absolutise (path) {
  return isAbsolute(path) ? path : join(cwd(), path);
}
