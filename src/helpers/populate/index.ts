import { config } from '@/config/env';
import { zipObj } from 'remeda';

const _ = require('lodash');
const app = require('../app');
const bluebird = require('bluebird');
const cachegoose = require('cachegoose');

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



function setInsertPriority(populateFiles: Record<string, string>) {
  const files = Object.keys(populateFiles).reverse();

  return zipObj(
    files,
    files.map(file => {
      return populateFiles[file];
    }),
  );
}
async function populate() {
  let until;

  const populateOpts = {
    app,
    operation: process.argv[2],
    whichModels: process.argv[3],
    // DO NOT CHANGE THIS
    COMMUNITY: 'test',
    until,
  };

  if (config.NODE_ENV == 'prod') {
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
    return dumpDatabases(populateOpts);
  }

  if (populateOpts.operation === 'reset') {
    await dumpDatabases(populateOpts);
    await createDatabases(populateOpts);
  }
}
async function createDatabases({ app, COMMUNITY, whichModels, until }) {
  // load models from data folder and sort them by priority

  const data = setInsertPriority(await import('./data'));

  // store all the ids for every model
  let ids = {};

  for (let model in data) {
    if (whichModels != null && !whichModels.includes(model)) continue;
    let generateData = data[model];

    // must pass the ids to generateData(ids), because some models need it
    let dataModels = generatedData(app, ids);

    // avoid wrong device sign up on dev enviroment
    // this can cause Firebase FCM problems
    if (app.config.ENV == 'dev' && model == 'user') {
      dataModels = dataModels.map((m) => {
        delete m.devices;
        return m;
      });
    }
  
  

    let Model, resp;

    Model = app.models[model].bySeason(app.helpers.season.findSeasonKey());
    if (['teachers', 'subjects', 'histories'].includes(model)) {
      Model = app.models[model];
    }

    let shouldIndex = Model.schema.plugins.some((p) =>
      _.get(p.opts, 'indexAutomatically', false)
    );

    // wait for everything being properly indexed in elasticsearch
    let saved = dataModels.map((data) => {
      return new Promise(function (resolve) {
        Model.create(data, (err, model) => {
          console.log(err);
          if (err) {
            throw new Error(err);
          }
          if (!shouldIndex) resolve(model);
          else
            model.once('es-indexed', () => {
              resolve(model);
            });
        });
      });
    });

    resp = await Promise.all(saved);

    // reload indexes
    if (shouldIndex) {
      let client = app.elastic;
      let refresh = bluebird.promisify(client.indices.refresh, {
        context: client,
      });
      let exists = bluebird.promisify(client.indices.exists, {
        context: client,
      });

      let indexName = model.toLowerCase();

      // refresh index if exists
      let indexExists = await exists({ index: indexName });
      if (indexExists) {
        await refresh({ index: indexName });
      }
    }

    // store response in ids.model
    ids[model] = resp;
    if (until != null && until.includes(model)) break;
  }

  return ids;
}

async function dumpDatabases({ app, COMMUNITY, whichModels, until }) {
  const data = setInsertPriority(await import('./data'));

  cachegoose.clearCache(null);
  await app.redis.cache.clear();

  for (let key in data) {
    if (whichModels != null && !whichModels.includes(key)) continue;

    let Model = app.models[key];

    // dump all indexes for a given model in elasticsearch
    if (_.isFunction(Model.search)) {
      let client = app.elastic;
      let remove = bluebird.promisify(client.indices.delete, {
        context: client,
      });
      let exists = bluebird.promisify(client.indices.exists, {
        context: client,
      });

      let indexName = key.toLowerCase();

      // remove index if exists
      let indexExists = await exists({ index: indexName });
      if (indexExists) {
        await remove({ index: indexName });
      }
    }

    await app.models[key].remove({});

    if (until != null && until.includes(key)) break;
  }
}
