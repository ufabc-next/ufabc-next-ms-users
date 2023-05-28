import { config } from '@/config/env';
import { dynamicImportAllFiles } from '../dynamic-import-all-files';
import { connectToMongo } from '@/database/connection';
import { Model } from 'mongoose';
// const cachegoose = require("cachegoose");

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

  if (!['insert', 'delete', 'reset'].includes(populateOpts.operation)) {
    throw new Error('Wrong operation. Choose between: insert, delete or reset');
  }

  console.info('Running populate...');
  if (populateOpts.operation === 'insert') {
    await connectToMongo();
    return createDatabases(populateOpts);
  }
  if (populateOpts.operation === 'delete') {
    await connectToMongo();
    return dumpDatabases(populateOpts);
  }
  if (populateOpts.operation === 'reset') {
    await connectToMongo();
    await dumpDatabases(populateOpts);
    await createDatabases(populateOpts);
  }
}

async function createDatabases({ whichModels }: PopulateOptions) {
  const files = await dynamicImportAllFiles('src/helpers/populate/data');
  for (const { default: model } of files) {
    const ids: Record<string, unknown> = {};
    if (whichModels != null && !whichModels.includes(model)) {
      continue;
    }
    const values = model(ids);
    const test = values.map(async (value: any) => {
      try {
        console.log(value);
        return Model.create(value);
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    const insertedValues = await Promise.all(test);
    return (ids[model] = insertedValues);
  }
}

async function dumpDatabases({ whichModels }: PopulateOptions) {
  const models = await dynamicImportAllFiles('src/helpers/populate/data');
  for (const model in models) {
    if (whichModels?.includes(model)) continue;
    await models[model].remove({});
  }
}
