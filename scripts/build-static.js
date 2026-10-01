import { cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const output = join(root, "public");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const item of ["css", "icons", "js"]) {
  await cp(join(root, item), join(output, item), { recursive: true });
}

for (const item of ["index.html", "manifest.json", "sw.js"]) {
  await cp(join(root, item), join(output, item));
}

console.log("Built static Yehaw PWA assets in public/.");