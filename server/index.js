const fs = require('fs');
const cors = require('cors');
const express = require('express');
const ethers = require('ethers');
const bodyParser = require('body-parser');

const DATABASE_FILE = './characters.db.json';

// get raw characters from database
const getRawCharacters = () => {
  if (!fs.existsSync(DATABASE_FILE))
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(require('./characters.default.json'), null, 2), 'utf8');
  return require(DATABASE_FILE);
};

// updates character to database
const updateCharacter = (data) => {
  fs.writeFileSync(DATABASE_FILE, JSON.stringify(getRawCharacters().map(character => {
    if (character.id === data.id)
      return {...character, ...data};
    return character;
  }), null, 2), 'utf8');
};

// syncs character owner from blockchain
const syncCharacter = async (data) => {
  const { abi } = require('./smart_contract/build/YameteKudasai.json');
  const { address } = require('./smart_contract/deployments/YameteKudasai.json');
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545');
  const contract = new ethers.Contract(address, abi, provider);

  data.owner = await contract.ownerOf(data.id);
  updateCharacter(data);
  return data;
};

// get characters from database and syncs owner from blockchain
const getCharacters = async() => {
  return Promise.all(getRawCharacters().map(a => syncCharacter(a)));
};

// gets character from database
const getCharacter = async(id) => {
  const characters = await getCharacters()
  for (const character of characters) {
    if (Number(id) === character.id)
      return character;
  }
  return null;
};

(async () => {
  try {
    const app = express();

    app.use(cors());

    app.use(bodyParser.urlencoded({ extended: false }))

    app.use(bodyParser.json())

    app.use(express.static('./public'));

    app.use(express.static('../webclient/build'));

    app.get('/metadata/characters', async (req, res, next) => {
      try {
        res.setHeader('Content-Type', 'application/json');
        await res.send(JSON.stringify(await getCharacters(), null, 2));
      } catch (e) {
        next(e);
      }
    });

    app.get('/metadata/characters/:token_id', async (req, res, next) => {
      try {
        const character = await getCharacter(req.params.token_id);
        res.setHeader('Content-Type', 'application/json');
        await res.send(JSON.stringify(character, null, 2));
      } catch (e) {
        next(e);
      }
    });

    app.post('/character-update', async (req, res, next) => {
      try {
        const { payload, signature } = req.body;
        const character = await getCharacter(payload.sub);
        const message = JSON.stringify(payload);
        const signerAddress = ethers.utils.verifyMessage(message, signature);
        const timestamp = new Date().getTime() / 1000;

        if (!character)
          throw new Error('character does not exist.');

        if (signerAddress.toLowerCase() !== character.owner.toLowerCase())
          throw new Error('Signer is not the owner of character.');

        if (!payload.exp || timestamp > payload.exp)
          throw new Error('payload has already expired.');

        if (!payload.params.description)
          throw new Error('description is required.');

        character.description = payload.params.description;
        character.statement = payload.params.statement;
        updateCharacter(character);

        await res.json(character);
      } catch (e) {
        next(e);
      }
    })

    app.use(async (req, res, next) => {
      const content = fs.readFileSync(`${__dirname}/../webclient/build/index.html`);
      res.setHeader('Content-Type', 'text/html');
      res.send(content);
    });

    const server = app.listen(88, () => {
      console.log(`Server running @ port ${server.address().port}`);
    });
  } catch (e) {
    console.trace(e);
    process.exit();
  }
})();
