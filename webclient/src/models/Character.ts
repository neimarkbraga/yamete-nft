import Api from '../libraries/Api';

export interface ICharacter {
  id: number
  owner: string
  name: string
  description: string
  statement: string
  urls: {
    profile: string
    metadata: string
    image: string
  }
}

class Character implements ICharacter {
  id: number
  owner: string
  name: string
  description: string
  statement: string
  urls: {
    profile: string
    metadata: string
    image: string
  }

  constructor(character: ICharacter) {
    this.id = character.id;
    this.owner = character.owner;
    this.name = character.name;
    this.description = character.description;
    this.statement = character.statement;
    this.urls = character.urls;
  }

  static async find(): Promise<Character[]> {
    const { data = [] } = await Api.get<ICharacter[]>('/metadata/characters');
    return data.map(ic => new Character(ic));
  }

  static async findById(id: string): Promise<Character|null> {
    const { data } = await Api.get<ICharacter|null>(`/metadata/characters/${id}`);
    return data ? new Character(data) : null;
  }
}

export default Character;
