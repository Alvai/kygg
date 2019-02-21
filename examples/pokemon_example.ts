// import Kygg
import { Kygg } from "../lib/kygg";

import * as dotenv from "dotenv";

dotenv.config();

// import your custom function
import { getPokemon } from "./pokemon";

// set your options
const options = {
  branch: process.env.BRANCH as string, // complete name of branch
  contentCallback: getPokemon, // function that provides commitContent && commitName
  cronSchedule: process.env.CRON_SCHEDULE as string, // cron string
  filename: process.env.FILENAME as string, // file to update
  githubURL: process.env.GITHUB_URL as string, // complete name of repository (owner/repo_name)
  oauthGithub: process.env.OAUTH_GITHUB as string // oauth token from github
};

// create an instance of Kygg
const instance = new Kygg(options);

// start the cron
instance.start();
