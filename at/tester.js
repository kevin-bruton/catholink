const {spawn, execFileSync} = require('child_process')

const selenium = spawn(
  'node',
  [
    'node_modules/selenium-standalone/bin/selenium-standalone',
    'start',
    '--config=./config/selenium.js'
  ]
)

selenium.on('close', (code) => {
  console.log('\nSelenium stopped')
})

selenium.stderr.on('data', (data) => {
  // console.log(`selenium stderr: ${data}`);
})

selenium.stdout.on('data', (data) => {
  console.log(`${data}`)
  execFileSync(
    'node',
    [
      'node_modules/cucumber/bin/cucumber-js',
      '--tags=@web',
      '--format', 'node_modules/cucumber-pretty',
      '--require', 'steps/**/*.js',
      '--require', 'features/**/*.js',
      '--require', 'config/**/*.js'
    ],
    {stdio: "inherit"}
  )
  selenium.kill()
})
