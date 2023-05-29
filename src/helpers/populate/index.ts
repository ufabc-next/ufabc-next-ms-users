import { join } from 'node:path';
import { config } from '@/config/env';
import { connectToMongo } from '@/database/connection';
import { dynamicImportAllFiles } from '../dynamic-import-all-files';

type PopulateOptions = {
  operation: string;
  whichModels: string;
  readonly COMMUNITY?: 'test';
};

// this file populates MongoDB test database with data
(async () => {
  try {
    await populate();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

async function populate() {
  const populateOpts = {
    operation: process.argv[2],
    whichModels: process.argv[3],
    // DO NOT CHANGE THIS
    COMMUNITY: 'test',
    // DO NOT CHANGE THIS
  } satisfies PopulateOptions;

  if (config.NODE_ENV === 'prod') {
    throw new Error('You cannot populate under production mode!!!');
  }

  if (!['insert', 'delete', 'reset', 'test'].includes(populateOpts.operation)) {
    throw new Error('Wrong operation. Choose between: insert, delete or reset')
      .message;
  }

  console.info('Running populate...');
  if (populateOpts.operation === 'insert') {
    await connectToMongo();
    console.log('inserting...');
    await createDatabases(populateOpts);
  }
  if (populateOpts.operation === 'delete') {
    await connectToMongo();
    await dumpDatabases(populateOpts);
  }
  if (populateOpts.operation === 'reset') {
    await connectToMongo();
    await dumpDatabases(populateOpts);
    await createDatabases(populateOpts);
  }

  if (populateOpts.operation === 'test') {
    await connectToMongo();
    await testePorra(populateOpts);
  }
}

async function createDatabases({ whichModels }: PopulateOptions) {
  const data = join(__dirname, './data');
  const Models = join(__dirname, '../../model');
  const files = await dynamicImportAllFiles(data);
  const appModels = await dynamicImportAllFiles(Models);
  for (const { default: model } of files) {
    const ids: Record<string, unknown> = {};
    if (whichModels?.includes(model)) continue;
    const modelsToInsert = appModels[model];
    console.log('teste', {
      appModelsMostre: appModels,
      filesToInsert: model,
      mescla: modelsToInsert,
    });
    const values = model(ids);
    const test = values.map(async (value: any) => {
      try {
        return modelsToInsert.create(value);
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    const insertedValues = await Promise.all(test);
    console.log('finish insert...');
    return (ids[model] = insertedValues);
  }
}

async function dumpDatabases({ whichModels }: PopulateOptions) {
  const data = join(__dirname, './data');
  const models = await dynamicImportAllFiles(data);
  for await (const { default: model } of models) {
    if (whichModels?.includes(model)) continue;
    await models[model].remove({});
  }
}

async function testePorra({ whichModels }: PopulateOptions) {
  const data = join(__dirname, './data');
  const Models = join(__dirname, '../../model');
  const files = await dynamicImportAllFiles(data);
  const appModels = await dynamicImportAllFiles(Models);
  console.log('nomes', files);
  for (let { default: models } of files) {
    models = appModels;
    console.log('fé em deus', models.default());
    const ids: Record<string, unknown> = {};
    if (whichModels?.includes(models)) continue;
    const values = models(ids);
    const test = values.map(async (value: any) => {
      try {
        return models.create(value);
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    const insertedValues = await Promise.all(test);
    console.log('finish insert...');
    return (ids[models] = insertedValues);
  }
}
