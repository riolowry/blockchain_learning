/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
  constructor(data) {
    this.hash = "";
    this.height = 0;
    this.body = data;
    this.timeStamp = 0;
    this.previousBlockHash = "";
  }
}

module.exports.Block = Block;
