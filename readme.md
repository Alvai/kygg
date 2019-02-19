# make-github-green-again

Scheduled functions in nodejs

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Support](#support)
- [Contributing](#contributing)

## Installation

Clone the project and install the dependencies:

```bash
npm i
```

Create a `.env` file with this template:

```bash
OAUTH_GITHUB=YOUR_GITHUB_OAUTH_TOKEN
OWNER=YOUR_GITHUB_USERNAME
REPO=YOUR_DESTINATION_REPO
BRANCH=YOUR_BRANCH
FILENAME=FILE_TO_EDIT
CRON_SCHEDULE=CRON_SCHEDULE_STRING # https://www.npmjs.com/package/node-cron
```

## Usage

Compile the typescript file and run the js file:

```bash
npm i -g typescript
tsc index.ts
node index.js
```

## Support

Please [open an issue](https://github.com/Alvai/make-github-green-again/issues/new) if you encounter any problems :relaxed:.

## Contributing

Feel free to clone, create a branch, add commits, and [open a pull request](https://github.com/Alvai/make-github-green-again/compare/) !
