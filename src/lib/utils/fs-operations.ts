import fs from 'fs/promises';
import path from 'path';

async function readJsonFile(filePath: string): Promise<object> {
  // @TODO: this path needs to be sanitized
  const absolutePath = path.resolve(filePath);
  const fileContents = await fs.readFile(absolutePath, { encoding: 'utf8' });
  const asJson = JSON.parse(fileContents) as object;

  return asJson;
}

export { readJsonFile };
