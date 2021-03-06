#!/usr/bin/env node

const { program } = require("commander");
const { makeTemplate, copy } = require("./template");
const inquirer = require("inquirer");
const chalk = require("chalk");
program.version("0.0.1", "-v, --version").name("cli");

program
  .command("template <type>")
  .usage("<type> --filename [filename] --path [path]")
  .description("create template")
  .alias("tmpl")
  .option("-f,--filename [filename]", "enter filename", "index")
  .option("-p --path [path]", "enter path of file", ".")
  .action((type, options) => {
    makeTemplate(type, options.filename, options.path);
  });

program
  .command("copy <originalpath> <newpath>")
  .usage("<original path> <new path>")
  .description("copy the file")
  .alias("cp")
  .action((originalpath, newpath) => {
    copy(originalpath, newpath);
  });

program.action((cmd, args) => {
  if (args.args.length > 0) {
    console.error(chalk.bold.red("could not found command"));
    program.help();
  } else {
    inquirer
      .prompt([
        {
          type: "list",
          name: "command",
          message: "which command?",
          choices: ["template", "copy"],
        },
      ])
      .then((answers) => {
        if (answers.command === "template") {
          inquirer
            .prompt([
              {
                type: "list",
                name: "type",
                message: "choose a templte",
                choices: ["html", "express-router"],
              },
              {
                type: "input",
                name: "name",
                message: "enter file name",
                default: "index",
              },
              {
                type: "input",
                name: "directory",
                message: "enter path of file",
                default: ".",
              },
              {
                type: "confirm",
                name: "confirm",
                message: "do you want create file?",
              },
            ])
            .then((answers) => {
              if (answers.confirm) {
                makeTemplate(answers.type, answers.name, answers.directory);
                console.log("exit terminal");
              }
            });
        } else {
          inquirer
            .prompt([
              {
                type: "input",
                name: "originalpath",
                message: "enter original file path",
              },
              {
                type: "input",
                name: "newpath",
                message: "enter new file path",
              },
              {
                type: "confirm",
                name: "confirm",
                message: "do you want create file?",
              },
            ])
            .then((answers) => {
              if (answers.confirm) {
                copy(answers.originalpath, answers.newpath);
                console.log("exit terminal");
              }
            });
        }
      });
  }
});

program.parse(process.argv);
