import axios, { AxiosInstance } from "axios";
import { schedule } from "node-cron";

export interface ICommitContent {
  commitContent: string;
  commitName: string;
}

export enum contentPosition {
  prefix = "prefix",
  suffix = "suffix"
}

export interface IKyggOptions {
  oauthGithub: string;
  githubURL: string;
  branch: string;
  filename: string;
  cronSchedule: string;
  contentCallback: () => ICommitContent | Promise<ICommitContent>;
  position?: contentPosition;
}

export interface ICommitCreation {
  parents: string[];
  tree: string;
  commitMessage: string;
}

export interface ICommit {
  sha: string;
  url: string;
  author: {
    date: string;
    name: string;
    email: string;
  };
  committer: {
    date: string;
    name: string;
    email: string;
  };
  message: string;
  tree: {
    url: string;
    sha: string;
  };
  parents: [
    {
      url: string;
      sha: string;
    }
  ];
  verification: {
    verified: boolean;
    reason: string;
    signature: null;
    payload: null;
  };
}

export interface IRef {
  ref: string;
  node_id: string;
  url: string;
  object: {
    type: string;
    sha: string;
    url: string;
  };
}

export interface ITreeCreation {
  commitSha: string;
  content: string;
  position: string;
}

export interface ITree {
  sha: string;
  url: string;
  tree: [
    {
      path: string;
      mode: string;
      type: string;
      size: number;
      sha: string;
      url: string;
    }
  ];
}

export class Kygg {
  private config: IKyggOptions;
  private githubInstance: AxiosInstance;
  constructor(options: IKyggOptions) {
    if (!options.position) {
      options.position = contentPosition.prefix;
    }
    this.config = options;
    this.githubInstance = this.createGithubInstance(
      this.config.githubURL,
      this.config.oauthGithub
    );
  }

  public start(): void {
    schedule(
      this.config.cronSchedule as string,
      async () => {
        const numberOfCommits = Math.floor(Math.random() * 8) + 1;
        for (let index = 0; index <= numberOfCommits; index++) {
          const headMaster = await this.getHeadMaster();
          const lastCommit = await this.getCommit(headMaster.object.sha);
          const {
            commitContent,
            commitName
          } = await this.config.contentCallback();
          const newTree = await this.createTree({
            commitSha: lastCommit.tree.sha,
            content: commitContent,
            position: contentPosition[this.config.position!]
          });
          const addedCommit = await this.createCommit({
            commitMessage: commitName,
            parents: [headMaster.object.sha],
            tree: newTree.sha
          });
          await this.push(addedCommit.sha);
        }
      },
      {}
    );
  }

  private createGithubInstance(
    githubURL: string,
    oauthToken: string
  ): AxiosInstance {
    const github = axios.create({
      baseURL: `https://api.github.com/repos/${githubURL}/`,
      headers: {
        Authorization: `token ${oauthToken}`
      }
    });
    return github;
  }

  private async getHeadMaster(): Promise<IRef> {
    const headMaster = await this.githubInstance.get(
      `git/refs/${this.config.branch}`
    );
    return headMaster.data;
  }

  private async getCommit(commitSha: string): Promise<ICommit> {
    const selectedCommit = await this.githubInstance.get(
      `git/commits/${commitSha}`
    );
    return selectedCommit.data;
  }

  private async getFileContent(
    filename: string = this.config.filename as string
  ): Promise<Buffer> {
    const content = await this.githubInstance.get(`contents/${filename}`);
    const decodedContent = Buffer.from(content.data.content, "base64");
    return decodedContent;
  }

  private async createTree({
    commitSha = "",
    content = "",
    position = "prefix"
  }: ITreeCreation): Promise<ITree> {
    const currentContent = await this.getFileContent();
    const prefixContent = position === "prefix" ? content : "";
    const suffixContent = position === "suffix" ? content : "";
    const completeContent = `${prefixContent}${currentContent}${suffixContent}`;
    const tree = {
      base_tree: commitSha,
      tree: [
        {
          content: completeContent,
          mode: "100644",
          path: this.config.filename
        }
      ]
    };
    const newTree = await this.githubInstance.post(`git/trees`, tree);
    return newTree.data;
  }

  private async createCommit(commitContent: ICommitCreation): Promise<ICommit> {
    const commitInfo = {
      message: commitContent.commitMessage,
      parents: commitContent.parents,
      tree: commitContent.tree
    };
    const newCommit = await this.githubInstance.post(`git/commits`, commitInfo);
    return newCommit.data;
  }

  private async push(sha: string): Promise<void> {
    const pushed = await this.githubInstance.patch(
      `git/refs/${this.config.branch}`,
      {
        force: true,
        sha
      }
    );
    return pushed.data;
  }
}
