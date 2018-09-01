const fs = require('fs')
const path = require('path')
const links = require('./route-alias-config')

const rootDir = path.join(__dirname, '..')
const nodeDir = path.join(rootDir, '/node_modules')

createLink(path.join(nodeDir, '~'), rootDir)

links.map(link => createLink(path.join(nodeDir, link.name), path.join(rootDir, link.target)))

console.log('Route aliases updated!\n')

function createLink (link, target) {
  if (!fs.existsSync(link)) {
    try {
      fs.symlinkSync(target, link, 'junction')
    } catch (err) {
      err.code !== 'EEXIST' && console.log(err)
    }
  }
}
