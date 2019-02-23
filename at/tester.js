const {spawn, execFileSync} = require('child_process')

const {tags, env} = getArgValues(process.argv)
console.log('tags:', tags, 'env:', env)

const selenium = spawn(
  'node',
  [
    'node_modules/selenium-standalone/bin/selenium-standalone',
    'start',
    '--config=./config/selenium.js'
  ]
)

selenium.on('close', code => {
  console.log('\nSelenium stopped')
})

selenium.stderr.on('data', data => {
  // console.log(`selenium stderr: ${data}`);
})

selenium.stdout.on('data', data => {
  console.log(`${data}`) // "Selenium started"
  try {
    execFileSync(
      'node',
      [
        'node_modules/cucumber/bin/cucumber-js',
        '--tags=' + (tags ? tags : '@maths'),
        '--format', 'node_modules/cucumber-pretty',
        '--require', 'steps/**/*.js',
        '--require', 'features/**/*.js',
        '--require', 'config/**/*.js'
      ],
      {stdio: "inherit"}
    )
  } catch (err) {
    console.log('ERRORS FOUND EXECUTING CUCUMBER TESTS')
  } finally {
    selenium.kill()
  }
})

function getArgValues (args) {
  const argTypes = ['tags', 'env']
  let argValues = {}
  for (let i = 2; i < args.length; i++) {
    const arg = args[i].split('=')
    argTypes.forEach(argType => (argValues[argType] = argValues[argType] || arg[0] === argType && arg[1]))
  }
  return argValues
}