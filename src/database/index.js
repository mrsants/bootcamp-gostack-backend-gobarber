import Sequelize from 'sequelize';
import File from '../app/models/File';
import User from '../app/models/User';
import Appointments from '../app/models/Appointments';
import DatabaseConfig from '../config/database';

const models = [User, File, Appointments];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(DatabaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
