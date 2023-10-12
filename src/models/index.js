import fs from 'fs';
import Sequelize from 'sequelize';
import path from 'path';
import config from '../config';
import { Pool } from 'pg';
import { raw } from 'body-parser';
const dbConfig = config.database.postgres;

console.log(config.database.postgres);
const db = {};
let sequelize;
sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  timezone: dbConfig.timezone,
  logging: false,
  dialect: 'postgres',
});

let pool = new Pool({
  user: dbConfig.user,
  host: dbConfig.host,
  database: dbConfig.db,
  password: dbConfig.password,
  port: dbConfig.port,
  logging: false,
  dialect: 'postgres',
});



fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
  if (db[modelName].seedData) {
    db[modelName].seedData(config);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.pool = pool;
// console.log(db.pool);


// console.log('results', result.rows);

export default db;

// module.exports = {
//   db,
// };
