# react-optimized-list

## Develop

Need node.js v18.12.1 as indicated in `.nvmrc`. Download the version on
[Node.js website](https://nodejs.org/download/release/v18.12.0/) or install the
[NVM (Node Version Manager)](https://github.com/nvm-sh/nvm) and run `nvm use` at
the root of this project.

1. `npm install`
2. `npm run dev`

### Troubleshooting
#### Git hook / Husky
Run theses commands to repair the git hooks
`./node_modules/.bin/commitizen` 
and 
`./node_modules/.bin/commitizen init cz-conventional-changelog --save-dev --save-exact`