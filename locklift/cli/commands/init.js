const { Command } = require("commander");
const path = require("path");
const fs = require("fs-extra");
const utils = require("./../utils");

const program = new Command();

program
  .name("init")
  .description("Initialize sample Locklift project in a directory")
  .requiredOption("-p, --path <path>", "Path to the project folder", ".")
  .option("-f, --force", "Ignore non-empty path", false)
  .action(options => {
    const pathEmpty = utils.checkDirEmpty(options.path);

    if (!pathEmpty && options.force === false) {
      console.error(`Directory at ${options.path} should be empty!`);
      return;
    }

    const sampleProjectPath = path.resolve(
      __dirname,
      "./../../../sample-project",
    );

    fs.copy(sampleProjectPath, options.path, err => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(`New Locklift project initialized in ${options.path}`);
    });

    let rootDir;
    if (options.path === ".") {
      rootDir = process.cwd();
    } else {
      rootDir = options.path;
    }
    const nodeModules = require
      .resolve("locklift/package.json")
      .replace("locklift/package.json", "");
    const configPath = path.resolve(
      nodeModules + "./../locklift/config/env.json",
    );

    // fs.writeJSONSync(
    //   configPath,
    //   JSON.stringify({ rootDir: rootDir, initialized: true }),
    //   err => {
    //     if (err) {
    //       throw err;
    //     }
    //   },
    // );
  });

module.exports = program;
