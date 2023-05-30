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
  const ids: Record<string, unknown> = {};
  for (const model in files) {
    if (whichModels?.includes(model)) continue;
    const models = files[model];
    const data = models(ids);
    const Model = appModels[model];
    const content = data.map(async (value: any) => {
      try {
        console.log('Actually inserting data');
        return Model.create(value);
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await Promise.all(content);
    // ids[model] = insertedValues;
  }
  return ids;
}

async function dumpDatabases({ whichModels }: PopulateOptions) {
  const data = join(__dirname, './data');
  const models = await dynamicImportAllFiles(data);
  for await (const { default: model } of models) {
    if (whichModels?.includes(model)) continue;
    await models[model].remove({});
  }
}

async function testePorra({ whichModels }: PopulateOptions) {}
