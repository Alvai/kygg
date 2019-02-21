# Kygg

Keep your github green !

this is a little side project to learn how cron works, it is heavily inspired by [Github Gardener](https://github.com/alexandersideris/github-gardener-bot)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Support](#support)
- [Contributing](#contributing)

## Installation

Clone the project and install the dependencies:

```bash
npm i kygg
```

## Usage

!!! FULL DOCUMENTATION NOT WRITTEN YET !!!

require kygg in your file and create an instance:

```js
// import Kygg
import { Kygg } from "../lib/kygg";

// set your options
const options = {
  branch: "BRANCH_FULL_NAME", // complete name of branch
  contentCallback: functionThatReturnsContent, // function that provides commitContent && commitName
  cronSchedule: "*/1 * * * *", // cron string
  filename: "FILENAME", // file to update
  githubURL: "OWNER/REPO_NAME", // complete name of repository (owner/repo_name)
  oauthGithub: "YOUR_TOKEN" // oauth token from github
};

// create an instance of Kygg
const instance = new Kygg(options);

// start the cron
instance.start();

```

## Support

Please [open an issue](https://github.com/Alvai/make-github-green-again/issues/new) if you encounter any problems :relaxed:.

## Contributing

Feel free to clone, create a branch, add commits, and [open a pull request](https://github.com/Alvai/make-github-green-again/compare/) !
