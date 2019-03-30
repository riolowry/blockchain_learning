/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require("crypto-js/sha256");
const LevelSandbox = require("./LevelSandbox.js");
const Block = require("./Block.js");

class Blockchain {
  constructor() {
    this.bd = new LevelSandbox.LevelSandbox();
    this.generateGenesisBlock();
  }

  // Helper method to create a Genesis Block (always with height= 0)
  // You have to options, because the method will always execute when you create your blockchain
  // you will need to set this up statically or instead you can verify if the height !== 0 then you
  // will not create the genesis block
  generateGenesisBlock() {
    const self = this;
    self
      .getBlockHeight()
      .then(height => {
        // console.log(`in genisis block checking height: ${height}`);
        if (height === 0) {
          // only create genisis block if there are no other blocks
          const genisisBlock = new Block.Block(
            "First block in the chain - Genesis block"
          );
          // console.log(`in (height === 0) going to add block: ${height} and block data:`);
          // console.log(genisisBlock);
          self.addBlock(genisisBlock);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Get block height, it is a helper method that return the height of the blockchain
  getBlockHeight() {
    const self = this;
    return new Promise(function(resolve, reject) {
      resolve(self.bd.getBlocksCount());
    });
  }

  getBlockChain() {
    const self = this;
    return new Promise(function(resolve, reject) {
      // resolve(self.bd.getBlocksCount());
      self.bd
        .getBlocksCount()
        .then((blocksCount) => {
          let promises = [];
          console.log(blocksCount)
          for (let height = 0; height < blocksCount; height++) {
            promises.push(self.getBlock(height));
          }

          return Promise.all(promises).then(results => {
            //return we want the list of blocks
            resolve(results);
          });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  // Add new block
  addBlock(block) {
    const self = this;
    return self
      .getBlockHeight()
      .then(height => {
        console.log(height);
        return new Promise(function(resolve, reject) {
          // block height
          block.height = height;
          // UTC timestamp
          block.timeStamp = new Date()
            .getTime()
            .toString()
            .slice(0, -3);
          if (height > 0) {
            // previous block hash
            self
              .getBlock(height - 1)
              .then(lastBlock => {
                block.previousHash = lastBlock.hash;
              })
              .catch(err => {
                console.log(err);
              });
          }
          // SHA256 requires a string of data
          block.hash = SHA256(JSON.stringify(block)).toString();
          // add block to chain
          const value = self.bd.addLevelDBData(height, block);
          resolve(value);
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Get Block By Height
  getBlock(height) {
    const self = this;
    return new Promise(function(resolve, reject) {
      const block = self.bd
        .getLevelDBData(height)
        .then(block => {
          resolve(block);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  // Validate if Block is being tampered by Block Height
  validateBlock(height) {
    const self = this;
    // console.log(`validating block: ${height}`);
    return new Promise(function(resolve, reject) {
      self
        .getBlock(height)
        .then(block => {
          // hash is added to block after, so must be removed to compute same hash
          const blockWithoutHash = { ...block, hash: "" };
          const blockHash = SHA256(JSON.stringify(blockWithoutHash)).toString();
          const validBlockHash = block.hash;
          if (validBlockHash === blockHash) {
            // console.log(`block ${height} is valid`);
            resolve(true);
          } else {
            // console.log(`block ${height} is invalid`);
            resolve(false);
          }
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  // Validate Blockchain
  validateChain() {
    // Add your code here
    let self = this;
    // getBlockHeight
    // Promise.all(promises).then((results) => { ... });
    return new Promise((resolve, reject) => {
      let promises = [];
      self
        .getBlockHeight()
        .then(chainHeight => {
          for (let height = 0; height < chainHeight; height++) {
            promises.push(self.validateBlock(height));
          }

          return Promise.all(promises).then(results => {
            //each result should be true or false, we want the list of false (invalid) results
            const invalids = results.filter(result => !result);
            resolve(invalids);
          });
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  // Utility Method to Tamper a Block for Test Validation
  // This method is for testing purpose
  _modifyBlock(height, block) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.bd
        .addLevelDBData(height, JSON.stringify(block).toString())
        .then(blockModified => {
          resolve(blockModified);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }
}

module.exports.Blockchain = Blockchain;
