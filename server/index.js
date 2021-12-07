const fs = require('fs');
const cors = require('cors');
const express = require('express');

const DATABASE_FILE = './characters.db.json';

// get characters from database
const getCharacters = () => {
  if (!fs.existsSync(DATABASE_FILE))
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(require('./characters.default.json'), null, 2), 'utf8');
  return require(DATABASE_FILE);
};

// gets character from database
const getCharacter = (id) => {
  for (const character of getCharacters()) {
    if (Number(id) === character.id)
      return character;
  }
  return null;
};

// updates character to database
const updateCharacter = (data) => {
  fs.writeFileSync(DATABASE_FILE, JSON.stringify(getCharacters().map(character => {
    if (character.id === data.id)
      return {...character, ...data};
    return character;
  }), null, 2), 'utf8');
};

(async () => {
  try {
    const app = express();

    app.use(cors());

    app.use(express.static('./public'));

    app.use(express.static('../webclient/build'));

    app.get('/metadata/characters', async (req, res, next) => {
      try {
        res.setHeader('Content-Type', 'application/json');
        await res.send(JSON.stringify(getCharacters(), null, 2));
      } catch (e) {
        next(e);
      }
    });

    app.get('/metadata/characters/:token_id', async (req, res, next) => {
      try {
        const character = getCharacter(req.params.token_id);
        res.setHeader('Content-Type', 'application/json');
        await res.send(JSON.stringify(character, null, 2));
      } catch (e) {
        next(e);
      }
    });

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
