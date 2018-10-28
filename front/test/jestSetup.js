const { spawnSync } = require('child_process')
const vcrProcess = require('./vcrProcess')

module.exports = (config) => {
  console.log('\nStarting VCR...')
  const process = spawnSync('node', ['../vcr'])
  vcrProcess.set(process)
}
