module.exports = {
  setGospel,
  getGospel
}

const gospel = {}

function setGospel (gospelToSet) {
  gospel.text = gospelToSet.text
  gospel.title = gospelToSet.title
}

function getGospel () {
  return gospel
}
