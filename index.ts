import axios from "axios";
import dotenv from "dotenv";
import { schedule } from "node-cron";

dotenv.config();

const {
  OAUTH_GITHUB,
  OWNER,
  REPO,
  BRANCH,
  FILENAME,
  CRON_SCHEDULE
} = process.env;

interface ICommit {
  parents: string[];
  tree: string;
  message: string;
}

const github = axios.create({
  baseURL: `https://api.github.com/repos/${OWNER}/${REPO}/git/`,
  headers: {
    Authorization: `token ${OAUTH_GITHUB}`
  }
});

const getHeadMaster = async () => {
  const headMaster = await github.get(`refs/heads/${BRANCH}`);
  return headMaster.data;
};

const getCommit = async (commitSha: string) => {
  const selectedCommit = await github.get(`commits/${commitSha}`);
  return selectedCommit.data;
};

const createTree = async (lastCommitSHA: string, content: string) => {
  const tree = {
    base_tree: lastCommitSHA,
    tree: [
      {
        content,
        mode: "100644",
        path: FILENAME
      }
    ]
  };
  const newTree = await github.post(`trees`, tree);
  return newTree.data;
};

const createCommit = async (commitContent: ICommit) => {
  const newCommit = await github.post(`commits`, commitContent);
  return newCommit.data;
};

const push = async (sha: string) => {
  const pushed = await github.patch(`refs/${BRANCH}`, {
    sha
  });
  return pushed.data;
};

schedule(
  CRON_SCHEDULE as string,
  async () => {
    console.log("job is running");
  },
  {}
);
