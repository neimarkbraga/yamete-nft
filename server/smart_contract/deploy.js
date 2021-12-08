const fs = require('fs');
const { ContractFactory, Wallet, providers } = require('ethers');
const {
  BUILD_FOLDER,
  DEPLOYMENTS_FOLDER
} = require('./utils.js');
require('dotenv').config();

(async () => {
  try {
    const files = fs.readdirSync(BUILD_FOLDER);
    const provider = new providers.JsonRpcProvider('http://127.0.0.1:7545');
    const privateKey = process.env.WALLET_PRIMARY_ADDRESS;
    const wallet = new Wallet(privateKey, provider);

    for(const file of files) {
      const contractFile = require(`${BUILD_FOLDER}/${file}`);
      const factory = new ContractFactory(contractFile.abi, contractFile.evm.bytecode.object, wallet);
      const contract = await factory.deploy();

      if (!fs.existsSync(DEPLOYMENTS_FOLDER)) fs.mkdirSync(DEPLOYMENTS_FOLDER);
      fs.writeFileSync(`${DEPLOYMENTS_FOLDER}/${new Date().getTime()}.${file}`, JSON.stringify(contract, null, 2), 'utf8');

      console.log('Deployment Done.');
    }
  } catch (e) {
    console.trace(e);
    process.exit();
  }
})();
