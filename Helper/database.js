const { Client } = require("pg");

class DataBase {
  static URL = "postgres://postgres:Satya@Manoj1@localhost:5434/DAR"
  // static db_URL = process.env.DATABASE_URL || "postgres://koelunmoodrpgs:b174fcdcf6fb587d97d1bb7942208bc83bf79cf1b640caa945af11c1bdf437c0@ec2-52-71-153-228.compute-1.amazonaws.com:5432/d76gqt8hkc4lj7";
  static DB = new Client({ connectionString: DataBase.URL });
  // static DB = new Client({ connectionString: DataBase.db_URL });

  static Connect() {
    DataBase.DB.connect();
  }
}

module.exports = DataBase;