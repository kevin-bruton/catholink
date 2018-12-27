export const MODE = {
  VCR: 'vcr',
  REAL: 'real'
}

export const backendMode = 'VCR'

export const backendHost = (() => {
  return {
    VCR: 'http://localhost:5500',
    REAL: 'http://localhost:5000'
  }[backendMode]
})()
