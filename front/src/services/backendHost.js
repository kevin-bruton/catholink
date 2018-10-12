const backendMode = 'VCR'

export default (() => {
  return {
    VCR: 'http://localhost:5500',
    REAL: 'http://localhost:5000'
  }[backendMode]
})()
