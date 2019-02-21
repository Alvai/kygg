import axios from "axios";

import { ICommitContent } from "../lib/kygg";

// Function must return type ICommitContent or Promise<ICommitContent>
const getPokemon = async (): Promise<ICommitContent> => {
  // select random pokemon
  const index = Math.floor(Math.random() * 807) + 1;
  // Get content from Pokeapi
  const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${index}`);
  // get name and picture from recovered data
  const {
    name,
    sprites: { front_default }
  } = res.data;
  // check if there is a picture
  const picture =
    front_default === null
      ? ":point_down: :hankey: no picture :hankey: :point_down:"
      : `![${name} picture](${front_default} '${name} picture')`;
  //
  return {
    commitContent: `${picture}<br>${name}<br>`,
    commitName: `${name} said Hi !`
  };
};

export { getPokemon };
