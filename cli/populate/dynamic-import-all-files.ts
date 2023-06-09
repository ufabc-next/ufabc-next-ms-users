import { statSync } from 'node:fs';
import { readdir } from 'node:fs/promises';

export async function dynamicImportAllFiles(directoryPath: string) {
  const files = await readdir(directoryPath);
  const importPromises = files.map(async (file) => {
    const filePath = `${directoryPath}/${file}`;
    if (statSync(filePath).isFile()) {
      const files = await import(filePath);
      return files;
    }
    // remove directories found
    return null;
  });
  const importedModules = await Promise.all(importPromises);
  const orderedModels = importedModules
    .filter((models) => models !== null)
    .reverse();
  const result = Object.assign({}, ...orderedModels);
  return result;
}
