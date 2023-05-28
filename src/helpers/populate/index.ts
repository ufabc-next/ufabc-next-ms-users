import { zipObj } from "remeda";
import { config } from "@/config/env";
import { dynamicImportAllFiles } from "../dynamic-import-all-files";
import { currentQuad } from "../find-quad";
import { connectToMongo } from "@/database/connection";
import { Model } from "mongoose";
// const cachegoose = require("cachegoose");

type PopulateOptions = {
  operation: string;
  whichModels: string;
  readonly COMMUNITY: "test";
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
    COMMUNITY: "test",
    // DO NOT CHANGE THIS
  } satisfies PopulateOptions;

  if (config.NODE_ENV === "prod") {
    throw new Error("You cannot populate under production mode!!!");
  }

  if (!["insert", "delete", "reset"].includes(populateOpts.operation)) {
    throw new Error("Wrong operation. Choose between: insert, delete or reset");
  }

  console.info("Running populate...");
  // await app.bootstrap(["config", "helpers", "mongo", "models", "redis"]);
  if (populateOpts.operation === "insert") {
    await connectToMongo();
    return createDatabases(populateOpts);
  }
  if (populateOpts.operation === "delete") {
    await connectToMongo();
    // return dumpDatabases(populateOpts);
  }
  if (populateOpts.operation === "reset") {
    await connectToMongo();
    // await dumpDatabases(populateOpts);
    await createDatabases(populateOpts);
  }
}

async function createDatabases({
  COMMUNITY,
  whichModels,
}: PopulateOptions) {
  const ids: Record<string, unknown> = {}
  const files = await dynamicImportAllFiles("src/helpers/populate/data");

  for (const { default: model } of files) {
    const ids: Record<string, unknown> = {}
    if (whichModels != null && !whichModels.includes(model)) {
      continue;
    }
    const values = model(ids)
    const quad = currentQuad();
    const test = values.map(async (value: unknown) => {
      try {
        Model.create(value)
      } catch(error) {
        console.log(error)
        throw error
      }
    })
    const insertedValues = await Promise.all(test)
    console.log('valores inseridos', insertedValues)
    ids[model] = insertedValues;
  }

  // for (const model in files) {
  //   const ids: Record<string, unknown> = {};
  //   if (whichModels != null && !whichModels.includes(model)) {
  //     continue;
  //   }
  //   const setupfiles = files[model];
  //   // console.log('model', model)
  //   const ModelsValue = setupfiles(ids);
  //   const quad = app.helpers.season.findSeasonKey();
  //   const Model = app.models[model].bySeason(quad);
  //   const pendingValues = ModelsValue.map(async (value: any) => {
  //     try {
  //       return Model.create(value);
  //     } catch (error) {
  //       throw error;
  //     }
  //   });
  //   const insertedValues = await Promise.all(pendingValues);
  //   ids[model] = insertedValues;
  // }
  
}
