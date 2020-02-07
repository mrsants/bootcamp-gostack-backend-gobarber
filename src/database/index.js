import Sequelize from 'sequelize';
import Mongoose from 'mongoose';
import File from '../app/models/File';
import User from '../app/models/User';
import Appointments from '../app/models/Appointments';
import DatabaseConfig from '../config/database';

const models = [User, File, Appointments];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(DatabaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = Mongoose.connect(
      process.env.MONGO_URL,
      { useNewUrlParser: true, useFindAndModify: true }
    );
  }
}

export default new Database();
