const { insertLog } = require('@db/log')

module.exports = async text => {
  const dateTime = new Date()
  const time = `${dateTime.toString().replace(/ *\([^)]*\) */g, '')} ${dateTime.getMilliseconds()}`
  await insertLog(time, text)
  console.log(time, text)
}
