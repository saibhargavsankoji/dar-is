const { Client } = require("pg");

class DataBase {

  /////////////////////////////////// FOR DEVELOPMENT 
  // static URL = "postgres://postgres:postgres@localhost:5432/DARIS"
  // static DB = new Client({connectionString: DataBase.URL});


  ///////////////////////////////////// FOR DEPLOYMENT
  static db_URL = process.env.DATABASE_URL || "postgres://znfvezzwjmhnfz:@ec2-54-144-45-5.compute-1.amazonaws.com:5432/datna5so9vtcc9";
  static DB = new Client({ connectionString: DataBase.db_URL,ssl:{rejectUnauthorized:false} });

  static Connect() {
    DataBase.DB.connect();
  }
}

module.exports = DataBase;