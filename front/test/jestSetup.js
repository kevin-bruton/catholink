const { spawn } = require('child_process')
const vcrProcess = require('./vcrProcess')

module.exports = async (config) => {
    console.log('\nStarting VCR...')
    const process = spawn('node', ['../vcr'])
    vcrProcess.set(process)
}
