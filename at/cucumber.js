const profile = [
  '--tags=@maths',
  '--format node_modules/cucumber-pretty',
  '--require steps/**/*.js',
  '--require features/**/*.js',
  '--require config/**/*.js'
].join(' ')

module.exports = { profile }
