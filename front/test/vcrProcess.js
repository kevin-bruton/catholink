module.exports = (() => {
  let process
  return {
    get: () => process,
    set: (vcrProcess) => (process = vcrProcess)
  }
})()
