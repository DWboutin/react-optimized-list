# react-optimized-list

## Maintenance / Development
This package only works with React for now, I'm trying to make it work for Preact but I need to continue my work on the other project.
It's my first React/Preact package, if any wants to contribute or give me some advices, it will be highly appreciated.

## Getting started
### Installation
`npm install --save react-optimized-list`

### Usage
React-optimized-list is an extremly simple component who will only renders the items in your list which are visible. 
You only have to wrap your list's items with this component and it will lazy-render them when they'll be visible.

Check `./src/App.tsx` to see an exemple. 

## Develop

Need node.js v18.12.1 as indicated in `.nvmrc`. Download the version on
[Node.js website](https://nodejs.org/download/release/v18.12.0/) or install the
[NVM (Node Version Manager)](https://github.com/nvm-sh/nvm) and run `nvm use` at
the root of this project.

1. `npm install`
2. `npm run dev`

### Todos
- [ ] Tests
- [ ] Having a build who considers sourcemaps correctly
- [ ] Separate components logic in hooks

### Troubleshooting
#### Git hook / Husky
Run theses commands to repair the git hooks
`./node_modules/.bin/commitizen` 
and 
`./node_modules/.bin/commitizen init cz-conventional-changelog --save-dev --save-exact`