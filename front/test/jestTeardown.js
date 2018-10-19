const vcrProcess = require('./vcrProcess')

module.exports = async (config) => {
    const process = vcrProcess.get()
    process.kill()
    console.log('Stopped VCR')
}