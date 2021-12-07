const fs = require('fs');

const BUILD_FOLDER = `${__dirname}/build`;
const CONTRACTS_FOLDER = `${__dirname}/contracts`;
const DEPLOYMENTS_FOLDER = `${__dirname}/deployments`;
const NODE_MODULES_FOLDER = `${__dirname}/../node_modules/`;

class Warning {
  constructor(message) {
    this.message = message;
  }
}

// get file dependency content of .sol file
const importDependency = (path) => {
  // check if file exists in node modules
  if (fs.existsSync(`${NODE_MODULES_FOLDER}/${path}`)) {
    return {
      contents: fs.readFileSync(`${NODE_MODULES_FOLDER}/${path}`, 'utf8')
    };
  }

  // check if file exists in contracts folder
  if (fs.existsSync(`${CONTRACTS_FOLDER}/${path}`)) {
    return {
      contents: fs.readFileSync(`${CONTRACTS_FOLDER}/${path}`, 'utf8')
    };
  }

  // return error if file not found
  return { error: 'File not found' };
};

// throw error
const throwErrorMessage = (message) => {
  throw new Error(message);
};

// log warning
const logWarningMessage = (message) => {
  console.warn(new Warning(message));
};

module.exports = {
  BUILD_FOLDER,
  CONTRACTS_FOLDER,
  DEPLOYMENTS_FOLDER,
  NODE_MODULES_FOLDER,

  importDependency,
  throwErrorMessage,
  logWarningMessage
};
