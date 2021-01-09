const { Client } = require("pg");

class DataBase {
  // static URL = "postgres://postgres:postgres@localhost:5432/DARIS"
  static db_URL = process.env.DATABASE_URL || "postgres://znfvezzwjmhnfz:@ec2-54-144-45-5.compute-1.amazonaws.com:5432/datna5so9vtcc9";
  // static DB = new Client({connectionString: DataBase.URL});6d4081ade9fb9245ce7df7cb3af688eeaf35a84c7b5bd76165932fd5a4930bdc
  static DB = new Client({ 
    connectionString: DataBase.db_URL,
    ssl:{
      rejectUnauthorized:false,
    }
  });

  static Connect() {
    DataBase.DB.connect();
  }
}

module.exports = DataBase;