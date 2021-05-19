require("dotenv").config();
const env = process.env;

const development = {
  username: env.DB_HOST,
  password: env.DB_PW,
  database: env.DB_NAME,
  host: env.DB_ADDR,
  dialect: "mysql",
};

const production = {
  username: env.DB_HOST,
  password: env.DB_PW,
  database: env.DB_NAME,
  host: env.DB_ADDR,
  dialect: "mysql",
};

const test = {
  username: env.DB_HOST,
  password: env.DB_PW,
  database: env.DB_NAME_TEST,
  host: env.DB_ADDR,
  dialect: "mysql",
};

module.exports = { development, production, test };
