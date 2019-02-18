import axios from "axios";
import dotenv from "dotenv";
import { schedule } from "node-cron";

dotenv.config();

const { OAUTH_GITHUB, OWNER, REPO, CRON_SCHEDULE } = process.env;

const github = axios.create({
  baseURL: `https://api.github.com/repos/${OWNER}/${REPO}/git/`,
  headers: {
    Authorization: `token ${OAUTH_GITHUB}`
  }
});

schedule(
  CRON_SCHEDULE as string,
  async () => {
    console.log("job is running");
  },
  {}
);
