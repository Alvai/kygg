// import Kygg
import { Kygg } from "../lib/kygg";

// import your custom function
import { getPokemon } from "./pokemon";

// set your options
const options = {
  branch: "BRANCH_FULL_NAME", // complete name of branch
  contentCallback: getPokemon, // function that provides commitContent && commitName
  cronSchedule: "*/1 * * * *", // cron string
  filename: "FILENAME", // file to update
  githubURL: "OWNER/REPO_NAME", // complete name of repository (owner/repo_name)
  oauthGithub: "YOUR_TOKEN" // oauth token from github
};

// create an instance of Kygg
const instance = new Kygg(options);

// start the cron
instance.start();
