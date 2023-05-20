import { config } from '@/config/env';
import { zipObj } from 'remeda'; // this file populates MongoDB test database with data
const _ = require('lodash');
const app = require('../app');
const bluebird = require('bluebird');
const requireSmart = require('require-smart');
const cachegoose = require('cachegoose')(
  /*
  If this file is imported, then it must export a function
  so that the requiree can call it
  But if it's called from terminal we just need to run it
  So, we need to check if it's an import
  */

  // run populate
  async function () {
    try {
      await populate();
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  },
)();

async function populate() {
  let operation, context, only, until;

  // check if running from terminal or is required

  if (config.NODE_ENV == 'prod') {
    throw new Error('You cannot populate under production mode!!!');
  }

  // DO NOT CHANGE THIS
  const COMMUNITY = 'test';
  // DO NOT CHANGE THIS

  if (!['add', 'remove', 'both'].includes(operation as any)) {
    throw new Error('Wrong operation. Choose between: add, remove or both');
  }

  if (context !== null && !['remote', 'local', null].includes(context as any)) {
    throw new Error('Wrong context. Choose between: remote or local');
  }

  // ONLY SET PROCESS WHEN USING TERMINAL, NOT FROM CODE
  // only show this when running from terminal

  if (context == 'remote') {
    process.env.MONGO_URL = process.env.POPULATE_REMOTE;
  }

  if (context == 'local' || context == null) {
    process.env.MONGO_URL = process.env.POPULATE_LOCAL || process.env.MONGO_URL;
  }

  if (operation == 'add') {
    return await createDatabases(app, COMMUNITY, only, until);
  }

  if (operation == 'remove') {
    return await dumpDatabases(app, COMMUNITY, only, until);
  }

  if (operation == 'both') {
    await dumpDatabases(app, COMMUNITY, only, until);
    const resp = await createDatabases(app, COMMUNITY, only, until);
    return resp;
  }
}

function setInsertPriority(obj: Record<string, unknown>) {
  const keys = Object.keys(obj).reverse();

  return zipObj(
    keys,
    keys.map(key => {
      return obj[key];
    }),
  );
}

// give models priorities
// it is necessary because some models needs ids (or models) from another models

async function createDatabases(app, COMMUNITY, only, until) {
  // load models from data folder and sort them by priority

  const data = setInsertPriority(await import('./data'));

  // store all the ids for every model
  const ids = {};

  for (const model in data) {
    if (only != null && !only.includes(model)) continue;
    const generateData = data[model];

    // must pass the ids to generateData(ids), because some models need it
    let dataModels = generateData(app, ids);

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

    const shouldIndex = Model.schema.plugins.some((p) =>
      _.get(p.opts, 'indexAutomatically', false),
    );

    // wait for everything being properly indexed in elasticsearch
    const saved = dataModels.map((data) => {
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
      const client = app.elastic;
      const refresh = bluebird.promisify(client.indices.refresh, {
        context: client,
      });
      const exists = bluebird.promisify(client.indices.exists, {
        context: client,
      });

      const indexName = model.toLowerCase();

      // refresh index if exists
      const indexExists = await exists({ index: indexName });
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

async function dumpDatabases(app, COMMUNITY, only, until) {
  const data = setInsertPriority(await import('./data'));

  cachegoose.clearCache(null);
  await app.redis.cache.clear();

  for (const key in data) {
    if (only != null && !only.includes(key)) continue;

    const Model = app.models[key];

    // dump all indexes for a given model in elasticsearch
    if (_.isFunction(Model.search)) {
      const client = app.elastic;
      const remove = bluebird.promisify(client.indices.delete, {
        context: client,
      });
      const exists = bluebird.promisify(client.indices.exists, {
        context: client,
      });

      const indexName = key.toLowerCase();

      // remove index if exists
      const indexExists = await exists({ index: indexName });
      if (indexExists) {
        await remove({ index: indexName });
      }
    }

    await app.models[key].remove({});

    if (until != null && until.includes(key)) break;
  }
}
