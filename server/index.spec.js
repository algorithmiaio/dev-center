const { expect } = require('chai')
require('mocha')
const axios = require('axios')
const shell = require('shelljs')
const os = require('os')

// Cleared before each test block runs - use to configure
let customEnv = {}
let serverPid;

const waitForServer = async (done) => {
  try {
    await axios.get('http://localhost:3000/developers')
    console.log('Server set up, running test...')
    done()
  } catch (err) {
    console.log('Server setting up, waiting...')
    setTimeout(() => waitForServer(done), 1000)
  }
}

const init = (done) =>  {
  console.log('Starting server...')
  const child = shell.exec('node server', {
    async: true,
    env: { ...shell.env, ...customEnv }
  })

  serverPid = child.pid

  waitForServer(done)
}

const cleanup = (done) => {
  customEnv = {}
  console.log(`Killing ${serverPid}`)
  const command = os.platform() === 'linux' ? 'pkill' : 'kill'
  shell.exec(`${command} -9 -P ${serverPid}`, { silent: true }, function (code, stdout, stderr) {
    console.log('Killed server')
    shell.exec('lsof -t -i :3000')
    console.log({ code, stdout, stderr })
    done()
  })
}

describe('Node Server: Defaults', () => {
  beforeEach(init)

  afterEach(cleanup)

  it('should return a 200 when spun up.', () => {
    return axios.get('http://localhost:3000/developers').then(function(res) {
      expect(res.status).to.equal(200);
    })
  })
})

describe('Disable X-XSS-Protection: Set', () => {
  before(function (done) {
    customEnv['DISABLE_X_XSS_PROTECTION'] = 'true'
    init(done)
  })

  afterEach(cleanup)

  it('should not set an x-xss-protection header if disabled', () => {
    return axios.get('http://localhost:3000/developers').then(function(res) {
      expect(res.headers['x-xss-protection']).to.equal(undefined);
    })
  })
})

describe('Disable X-Content-Type-Options: Set', () => {
  before(function (done) {
    customEnv['DISABLE_X_CONTENT_TYPE_OPTIONS'] = 'true'
    init(done)
  })

  afterEach(cleanup)

  it('should not send a X-Content-Type-Options header if disabled', () => {
    return axios.get('http://localhost:3000/developers').then(function(res) {
      expect(res.headers['x-content-type-options']).to.equal(undefined);
    })
  })
})

describe('Disable X-Frame-Options: Set', () => {
  before(function (done) {
    customEnv['DISABLE_X_FRAME_OPTIONS'] = 'true'
    init(done)
  })

  afterEach(cleanup)

  it('should not send a X-Frame-Options header if disabled', () => {
    return axios.get('http://localhost:3000/developers').then(function(res) {
      expect(res.headers['x-frame-options']).to.equal(undefined);
    })
  })
})

describe('Disable HSTS: Set', () => {
  before(function (done) {
    customEnv['DISABLE_HSTS'] = 'true'
    init(done)
  })

  afterEach(cleanup)

  it('should not send a Strict-Transport-Security header if disabled', () => {
    return axios.get('http://localhost:3000/developers').then(function(res) {
      expect(res.headers['strict-transport-security']).to.equal(undefined);
    })
  })
})

describe('Defaults', () => {
  before(function (done) {
    init(done)
  })

  afterEach(cleanup)

  it('should set security headers by default', () => {
    return axios.get('http://localhost:3000/developers').then(function(res) {

      expect(res.headers['x-xss-protection']).to.equal('1');
      expect(res.headers['x-content-type-options']).to.equal('nosniff');
      expect(res.headers['x-frame-options']).to.equal('deny');
      expect(res.headers['strict-transport-security']).to.equal('max-age=86400; includeSubDomains');
    })
  })
})
