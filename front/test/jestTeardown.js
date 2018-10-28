const vcrProcess = require('./vcrProcess')

module.exports = (config) => {
  const process = vcrProcess.get()
  process.kill()
  console.log('Stopped VCR')
}
