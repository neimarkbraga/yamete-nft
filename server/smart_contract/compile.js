const fs = require('fs');
const solc = require('solc');
const {
  BUILD_FOLDER,
  CONTRACTS_FOLDER,
  importDependency,
  throwErrorMessage,
  logWarningMessage
} = require('./utils.js');

(async () => {
  try {
    const contractFiles = [
      'YameteKudasai.sol'
    ];

    for (const file of contractFiles) {
      const content = fs.readFileSync(`${CONTRACTS_FOLDER}/${file}`, 'utf8');
      const output = JSON.parse(solc.compile(JSON.stringify({
        language: 'Solidity',
        sources: {[file]: { content }},
        settings: {outputSelection: {'*': {'*': ['*']}}}
      }), { import: importDependency }));

      for (const error of output.errors) {
        const isWarning = /Warning/gi.test(error.type);
        if (isWarning) logWarningMessage(error.message);
        else throwErrorMessage(error.message);
      }

      for (const [name, contract] of Object.entries(output.contracts[file] || {})) {
        if (!fs.existsSync(BUILD_FOLDER)) fs.mkdirSync(BUILD_FOLDER);
        fs.writeFileSync(`${BUILD_FOLDER}/${name}.json`, JSON.stringify(contract, null, 2), 'utf8');
      }

      console.log('Compilation Done.');
    }
  } catch (e) {
    console.trace(e);
    process.exit();
  }
})();
