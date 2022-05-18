const fs = require('fs-extra')
const childProcess = require('child_process')
const colors = require('colors')

// Important: assumes CWD to be root path of solution

try {
  // Remove current build
  fs.removeSync('./dist')

  // Copy front-end files
  fs.copySync('./package.json', './dist/package.json')
  
  // Transpile typescript
  childProcess.spawn(
    './node_modules/.bin/tsc --build tsconfig.json',
    { shell: true, stdio: 'inherit' }
  ).on('exit', err => {
    if (err) {
      console.log(colors.red('COMPLETED WITH ERRORS'))
    } else {
      console.log(colors.green('Transpilation Success!'))
    }
  })
} catch (err) {
  console.log(err)
}
