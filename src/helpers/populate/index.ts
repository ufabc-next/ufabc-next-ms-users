import { config } from "@/config/env";
import { zipObj } from "remeda";

// 2 more to remove
const app = require("../app");
const cachegoose = require("cachegoose");

type PopulateOptions = {
  app: any;
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

function setInsertPriority(
  populateFiles: Record<
    string,
    (ids?: Record<string, unknown>) => Array<unknown>
  >
) {
  const files = Object.keys(populateFiles).reverse();

  return zipObj(
    files,
    files.map((file) => {
      return populateFiles[file];
    })
  );
}

async function populate() {
  // Figure out what this do

  const populateOpts = {
    app,
    operation: process.argv[2],
    whichModels: process.argv[3],
    // DO NOT CHANGE THIS
    COMMUNITY: "test",
  } satisfies PopulateOptions;

  if (config.NODE_ENV === "prod") {
    throw new Error("You cannot populate under production mode!!!");
  }

  if (!["insert", "delete", "reset"].includes(populateOpts.operation)) {
    throw new Error("Wrong operation. Choose between: insert, delete or reset");
  }

  console.info("Bootstrapping necessary components...");
  console.info();
  // Preciso prover isso la do outro lado para nao quebrar o populate
  await app.bootstrap(["config", "helpers", "mongo", "models", "redis"]);

  if (populateOpts.operation === "insert") {
    return createDatabases(populateOpts);
  }

  if (populateOpts.operation === "delete") {
    // return dumpDatabases(populateOpts);
  }

  if (populateOpts.operation === "reset") {
    // await dumpDatabases(populateOpts);
    await createDatabases(populateOpts);
  }
}

async function createDatabases({
  app,
  COMMUNITY,
  whichModels,
}: PopulateOptions) {
  const data = setInsertPriority(await import("./data"));
  for (const model in data) {
    const ids: Record<string, unknown> = {};
    if (whichModels != null && !whichModels.includes(model)) {
      continue;
    }
    const setupData = data[model];
    const ModelsValue = setupData(ids);
    const quad = app.helpers.season.findSeasonKey();
    const Model = app.models[model].bySeason(quad);
    const pendingValues = ModelsValue.map(async (value) => {
      try {
        return Model.create(value);
      } catch (error) {
        throw error;
      }
    });
    const insertedValues = await Promise.all(pendingValues);
    ids[model] = insertedValues;
  }
}
