/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require("level");
const chainDB = "./chaindata";

class LevelSandbox {
  constructor() {
    this.db = level(chainDB, { valueEncoding: 'json' }); // needed to switch to value encoding to get the db value properly
  }

  // Get data from levelDB with key (Promise)
  getLevelDBData(key) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.db.get(key, (err, value) => {
        if (err) {
          if (err.type == "NotFoundError") {
            resolve(undefined);
          } else {
            console.log("Block " + key + " get failed", err);
            reject(err);
          }
        } else {
          resolve(value);
        }
      });
    });
  }

  // Add data to levelDB with key and value (Promise)
  addLevelDBData(key, value) {
    let self = this;
    return new Promise(function(resolve, reject) {
      // todo do I need to JSON.stringify the value before putting????
      self.db.put(key, value, function(err) {
        if (err) {
          console.log("Block " + key + " submission failed", err);
          reject(err);
        }
        resolve(value);
      });
    });
  }

  // Method that return the height
  getBlocksCount() {
    let self = this;
    return new Promise(function(resolve, reject) {
      let count = 0;
      self.db
        .createReadStream()
        .on("data", function(data) {
          // Count each object inserted
          count++;
        })
        .on("error", function(err) {
          // reject with error
          reject(err);
        })
        .on("close", function() {
          //resolve with the count value
          resolve(count);
        });
    });
  }
}

module.exports.LevelSandbox = LevelSandbox;
