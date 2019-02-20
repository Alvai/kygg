import axios from "axios";
import * as dotenv from "dotenv";
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
  commitMessage: string;
}

interface ITreeCreation {
  commitSha: string;
  content: string;
  position: string;
}

const github = axios.create({
  baseURL: `https://api.github.com/repos/${OWNER}/${REPO}/`,
  headers: {
    Authorization: `token ${OAUTH_GITHUB}`
  }
});

const getHeadMaster = async () => {
  const headMaster = await github.get(`git/refs/${BRANCH}`);
  return headMaster.data;
};

const getCommit = async (commitSha: string) => {
  const selectedCommit = await github.get(`git/commits/${commitSha}`);
  return selectedCommit.data;
};

const getFileContent = async (filename: string = FILENAME as string) => {
  const content = await github.get(`contents/${filename}`);
  const decodedContent = Buffer.from(content.data.content, "base64");
  return decodedContent;
};

const createTree = async ({
  commitSha = "",
  content = "",
  position = "prefix"
}: ITreeCreation) => {
  const currentContent = await getFileContent();
  const prefixContent = position === "prefix" ? content : "";
  const suffixContent = position === "suffix" ? content : "";
  const completeContent = `${prefixContent}${currentContent}${suffixContent}`;
  const tree = {
    base_tree: commitSha,
    tree: [
      {
        content: completeContent,
        mode: "100644",
        path: FILENAME
      }
    ]
  };
  const newTree = await github.post(`git/trees`, tree);
  return newTree.data;
};

const createCommit = async (commitContent: ICommit) => {
  const commitInfo = {
    message: commitContent.commitMessage,
    parents: commitContent.parents,
    tree: commitContent.tree
  };
  const newCommit = await github.post(`git/commits`, commitInfo);
  return newCommit.data;
};

const push = async (sha: string) => {
  const pushed = await github.patch(`git/refs/${BRANCH}`, {
    sha,
    force: true
  });
  return pushed.data;
};

// Get content from Pokeapi
const getPokemon = async () => {
  const index = Math.floor(Math.random() * 807) + 1;
  const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${index}`);
  const {
    name,
    sprites: { front_default }
  } = res.data;
  const picture =
    front_default === null
      ? ""
      : `![${name} picture](${front_default} '${name} picture')`;
  return {
    content: `${picture}<br>${name}<br>`,
    currentPoke: name
  };
};

schedule(
  CRON_SCHEDULE as string,
  async () => {
    const numberOfCommits = Math.floor(Math.random() * 8) + 1;
    for (let index = 0; index <= numberOfCommits; index++) {
      const headMaster = await getHeadMaster();
      const lastCommit = await getCommit(headMaster.object.sha);
      // you can create any function you want to provide the content for the commit and th commit message
      // Mine is getting pokemons
      const pokemon = await getPokemon();
      const newTree = await createTree({
        commitSha: lastCommit.tree.sha,
        content: pokemon.content,
        position: "prefix"
      });
      const addedCommit = await createCommit({
        commitMessage: `${pokemon.currentPoke} said Hi !`,
        parents: [headMaster.object.sha],
        tree: newTree.sha
      });
      await push(addedCommit.sha);
    }
  },
  {}
);
