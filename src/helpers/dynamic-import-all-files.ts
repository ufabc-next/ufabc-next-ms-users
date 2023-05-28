import { statSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { zipObj } from 'remeda';

async function setInsertPriority(populateFiles: Record<string, any>) {
  const files = Object.keys(populateFiles).reverse();

  return zipObj(
    files,
    files.map((file) => {
      return populateFiles[file];
    }),
  );
}

export async function dynamicImportAllFiles(directoryPath: string) {
  const files = await readdir(directoryPath);
  const importPromises = files.map(async (file) => {
    const filePath = `${directoryPath}/${file}`;
    if (statSync(filePath).isFile()) {
      const files = await import(filePath);
      return files;
    }
  });
  const importedModules = await Promise.all(importPromises);
  const orderedModels = importedModules.reverse();
  return orderedModels;
}
