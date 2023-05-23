import { config } from '@/config/env';
import { zipObj } from 'remeda';

const _ = require('lodash');
const app = require('../app');
const bluebird = require('bluebird');
const cachegoose = require('cachegoose');

type PopulateOptions = {
  app: any
  operation: string
  whichModels: string
  readonly COMMUNITY: 'test',
}

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

function setInsertPriority(
  populateFiles: Record<string, (ids?: Record<string, unknown>) => Array<unknown>>,
) {
  const files = Object.keys(populateFiles).reverse();

  return zipObj(
    files,
    files.map((file) => {
      return populateFiles[file];
    }),
  );
}

async function populate() {
  // Figure out what this do

  const populateOpts = {
    app,
    operation: process.argv[2],
    whichModels: process.argv[3],
    // DO NOT CHANGE THIS
    COMMUNITY: 'test',
  } satisfies PopulateOptions;

  if (config.NODE_ENV === 'prod') {
    throw new Error('You cannot populate under production mode!!!');
  }

  if (!['insert', 'delete', 'reset'].includes(populateOpts.operation)) {
    throw new Error('Wrong operation. Choose between: insert, delete or reset');
  }

  console.info('Bootstrapping necessary components...');
  console.info();
  // Preciso prover isso la do outro lado para nao quebrar o populate
  await app.bootstrap(['config', 'helpers', 'mongo', 'models', 'redis']);

  if (populateOpts.operation === 'insert') {
    return createDatabases(populateOpts);
  }

  if (populateOpts.operation === 'delete') {
    // return dumpDatabases(populateOpts);
  }

  if (populateOpts.operation === 'reset') {
    // await dumpDatabases(populateOpts);
    await createDatabases(populateOpts);
  }
}

async function createDatabases({ app, COMMUNITY, whichModels }: PopulateOptions) {
  // load models from data folder and sort them by priority
  const models = setInsertPriority(await import('./data'));
  // store all the ids for every model
  const ids = {};

  for (const model in models) {
    // Se for passado um modelo, na cli popule e siga em frente
    if (!whichModels.includes(model)) continue;
    const generatedData = models[model]
    const data = generatedData(ids);

    // avoid wrong device sign up on dev enviroment
    // this can cause Firebase FCM problems
    if (config.NODE_ENV === 'dev' && model === 'user') {
      data.forEach((model: any) => {
        // perf wise is better than `delete`
        model.devices = undefined;
      });
    }

    // TODO: implement byQuad function and findQuad
    let Model = models[model].byQuad(quad.findQuadKey)

    if (['teachers', 'subjects', 'histories'].includes(model)) {
      Model = models[model]
    }

    // don't even know where to start here
    // const shouldIndex = Model.schema.plugins.some((p) =>
    //   _.get(p.opts, 'indexAutomatically', false)
    // );

    const insertedInDatabase = data.map(value => {
      return new Promise((resolve, reject) => {
      })
    })
  }
  
  return ids;
}
