const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const htmlTemplate = `
<!DOCTYPE html>
  <html>
  <head>
    <meta chart="utf-8" />
    <title>Template</title>
  </head>
  <body>
    <h1>Hello</h1>
    <p>CLI</p>
  </body>
</html>
`;

const routerTemplate = `
const express = require('express');
const router = express.Router();
 
router.get('/', (req, res, next) => {
   try {
     res.send('ok');
   } catch (error) {
     console.error(error);
     next(error);
   }
});
 
module.exports = router;
`;

const exist = (dir) => {
  try {
    fs.accessSync(
      dir,
      fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK
    );
    return true;
  } catch (e) {
    return false;
  }
};

const makeTemplate = (type, name, directory) => {
  const dir = path.normalize(directory);
  fs.mkdirSync(dir, { recursive: true });
  let filepath = "";
  let template = "";
  if (type === "html") {
    filepath = path.join(dir, `${name}.html`);
    template = htmlTemplate;
  } else if (type === "express-router") {
    filepath = path.join(dir, `${name}.js`);
    template = routerTemplate;
  } else {
    console.error(chalk.bold.red(`enter "html" or "express-router"`));
    return;
  }

  if (exist(filepath)) {
    console.error(chalk.bold.red(`${filepath} already exist`));
  } else {
    fs.writeFileSync(filepath, template);
    console.log(chalk.green(`${filepath} created`));
  }
};

module.exports = {
  makeTemplate,
};
