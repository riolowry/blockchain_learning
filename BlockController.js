const SHA256 = require("crypto-js/sha256");

const BlockChain = require("./BlockChain.js");
const BlockClass = require("./Block.js");

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {
  /**
   * Constructor to create a new BlockController, you need to initialize here all your endpoints
   * @param {*} app
   */
  constructor(app) {
    this.app = app;
    this.chain = new BlockChain.Blockchain();
    this.createMockData();
    this.getBlockChainHeight();
    this.getBlockByHeight();
    this.postNewBlock();
    this.getBlockChainList();
    this.validateBlockAtHeight();
    this.validateBlockChain();
    this.createInvalidBlocks();
  }

  /**
   * Implement a GET Endpoint to retrieve a blockchain height, url: "/api/blockheight/"
   */
  getBlockChainHeight() {
    this.app.get("/api/blockheight/", (req, res) => {
      this.chain.getBlockHeight().then(height => {
        console.log(height);

        res.send(`Blockchain height: ${height}\n`);
      });
    });
  }

  /**
   * Implement a GET Endpoint to retrieve the full blockchain, url: "/api/block/"
   * ** For testing purposes only, a real world blockchain would be to large for a single call **
   */
  getBlockChainList() {
    const self = this;
    this.app.get("/api/block/", (req, res) => {
      self.chain.getBlockChain().then(chain => {
        console.log(chain);

        res.send(chain);
      });
    });
  }

  /**
   * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
   */
  getBlockByHeight() {
    this.app.get("/api/block/:height", (req, res) => {
      const blockId = req.params.height;
      console.log(blockId);
      this.chain.getBlock(blockId).then(block => {
        const message = {
          message: `requested blockId: ${blockId}\n`,
          block: block
        };
        res.send(message);
      });
    });
  }

  /**
   * Implement a POST Endpoint to add a new Block, url: "/api/block"
   */
  postNewBlock() {
    this.app.post("/api/block", (req, res) => {
      const { data } = req.body;
      console.log(data);
      let newBlock = new BlockClass.Block(data);
      this.chain
        .addBlock(newBlock)
        .then(value => {
          const message = {
            value,
            data
          };
          res.status(200).send(message);
        })
        .catch(err => {
          console.log(err);
          res.status(500).send(err);
        });
    });
  }

  /**
   * Implement a GET Endpoint to retrieve a block by index, url: "/api/validate/:height"
   */
  validateBlockAtHeight() {
    this.app.get("/api/validate/:height", (req, res) => {
      const blockId = req.params.height;
      console.log(blockId);
      this.chain
        .validateBlock(blockId)
        .then(valid => {
          const message = {
            message: `requested blockId: ${blockId}\n`,
            valid
          };
          res.send(message);
        })
        .catch(err => {
          console.log(err);
          res.status(500).send(err);
        });
    });
  }

  /**
   * Implement a GET Endpoint to retrieve a block by index, url: "/api/validate/:height"
   */
  validateBlockChain() {
    this.app.get("/api/validate/", (req, res) => {
      this.chain
        .validateChain()
        .then(errorLog => {
          const message = {
            message: `chain errorlog\n`,
            errorLog
          };
          res.send(message);
        })
        .catch(err => {
          console.log(err);
          res.status(500).send(err);
        });
    });
  }

  createInvalidBlocks() {
    const self = this;
    this.app.post("/api/createInvalidBlocks/", (req, res) => {
      /** Tampering a Block this is only for the purpose of testing the validation methods */
      // /*
      // todo check chain height first
      self.chain
        .getBlock(5)
        .then(block => {
          let blockAux = block;
          blockAux.body = "Tampered Block";
          self.chain
            ._modifyBlock(blockAux.height, blockAux)
            .then(blockModified => {
              if (blockModified) {
                self.chain
                  .validateBlock(blockAux.height)
                  .then(valid => {
                    console.log(
                      `Block #${blockAux.height}, is valid? = ${valid}`
                    );
                  })
                  .catch(error => {
                    console.log(error);
                  });
              } else {
                console.log("The Block wasn't modified");
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });

      self.chain
        .getBlock(6)
        .then(block => {
          let blockAux = block;
          blockAux.previousBlockHash = "jndininuud94j9i3j49dij9ijij39idj9oi";
          self.chain
            ._modifyBlock(blockAux.height, blockAux)
            .then(blockModified => {
              if (blockModified) {
                console.log("The Block was modified");
              } else {
                console.log("The Block wasn't modified");
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
      res.status(200).send("Block tampered with!\n");
    }); // end
    // */
  }
  /**
   * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
   */
  createMockData() {
    const self = this;
    this.app.post("/api/createTestData/", (req, res) => {
      const theLoop = i => {
        setTimeout(function() {
          let blockTest = new BlockClass.Block("Test Block - " + (i + 1));
          self.chain
            .addBlock(blockTest)
            .then(result => {
              console.log(result);
              i++;
              if (i < 10) {
                theLoop(i);
              } else {
                res.status(200).send("Test blocks created!\n");
              }
            })
            .catch(err => {
              console.log(err);
              res.status(500).send(err);
            });
        }, 500);
      };
      theLoop(0);
    });
  }
}

/**
 * Exporting the BlockController class
 * @param {*} app
 */
module.exports = app => {
  return new BlockController(app);
};
