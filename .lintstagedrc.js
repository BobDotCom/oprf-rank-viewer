const path = require('path')

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

module.exports = {
  // All js, jsx, ts, tsx files
  '*.{js,jsx,ts,tsx}': [
    buildEslintCommand,
    "prettier --write",
  ],
  // All files excluding js, jsx, ts, tsx
  '*.!(js|jsx|ts|tsx)': [
    "prettier --write --ignore-unknown",
  ],

}
