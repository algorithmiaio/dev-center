const { expect } = require('chai');
require('mocha');
const axios = require('axios');
const shell = require('shelljs');
const os = require('os');

// Cleared before each test block runs - use to configure
let customEnv = {};
let serverPid;

const waitForServer = async (done) => {
  try {
    await axios.get('http://localhost:4000/developers');
    console.log('Server set up, running test...');
    done();
  } catch (err) {
    console.log('Server setting up, waiting...');
    setTimeout(() => waitForServer(done), 1000);
  }
};

const init = (done) => {
  console.log('Starting server...');
  const child = shell.exec('node server', {
    async: true,
    env: { ...shell.env, ...customEnv },
  });

  serverPid = child.pid;

  waitForServer(done);
};

const cleanup = (done) => {
  customEnv = {};
  console.log(`Killing ${serverPid}`);
  const command = os.platform() === 'linux' ? 'pkill' : 'kill';
  shell.exec(
    `${command} -9 -P ${serverPid}`,
    { silent: true },
    function (code, stdout, stderr) {
      console.log('Killed server');
      shell.exec('lsof -t -i :4000');
      console.log({ code, stdout, stderr });
      done();
    }
  );
};

describe('Node Server: Defaults', () => {
  beforeEach(init);

  afterEach(cleanup);

  it('should return a 200 when spun up.', () => {
    return axios.get('http://localhost:4000/developers').then(function (res) {
      expect(res.status).to.equal(200);
    });
  });
});

describe('Disable X-XSS-Protection: Set', () => {
  before(function (done) {
    customEnv['DISABLE_X_XSS_PROTECTION'] = 'true';
    init(done);
  });

  afterEach(cleanup);

  it('should not set an x-xss-protection header if disabled', () => {
    return axios.get('http://localhost:4000/developers').then(function (res) {
      expect(res.headers['x-xss-protection']).to.equal(undefined);
    });
  });
});

describe('Disable X-Content-Type-Options: Set', () => {
  before(function (done) {
    customEnv['DISABLE_X_CONTENT_TYPE_OPTIONS'] = 'true';
    init(done);
  });

  afterEach(cleanup);

  it('should not send a X-Content-Type-Options header if disabled', () => {
    return axios.get('http://localhost:4000/developers').then(function (res) {
      expect(res.headers['x-content-type-options']).to.equal(undefined);
    });
  });
});

describe('Disable X-Frame-Options: Set', () => {
  before(function (done) {
    customEnv['DISABLE_X_FRAME_OPTIONS'] = 'true';
    init(done);
  });

  afterEach(cleanup);

  it('should not send a X-Frame-Options header if disabled', () => {
    return axios.get('http://localhost:4000/developers').then(function (res) {
      expect(res.headers['x-frame-options']).to.equal(undefined);
    });
  });
});

describe('Disable HSTS: Set', () => {
  before(function (done) {
    customEnv['DISABLE_HSTS'] = 'true';
    init(done);
  });

  afterEach(cleanup);

  it('should not send a Strict-Transport-Security header if disabled', () => {
    return axios.get('http://localhost:4000/developers').then(function (res) {
      expect(res.headers['strict-transport-security']).to.equal(undefined);
    });
  });
});

describe('Enforce CSP: Set', () => {
  before(function (done) {
    customEnv['ENFORCE_CSP'] = 'true';
    init(done);
  });

  afterEach(cleanup);

  it('should set CSP header', () => {
    return axios.get('http://localhost:4000/developers').then(function (res) {
      expect(res.headers['content-security-policy']).to.not.be.undefined;
    });
  });
});

describe('Defaults', () => {
  before(function (done) {
    init(done);
  });

  afterEach(cleanup);

  it('should set security headers by default', () => {
    return axios.get('http://localhost:4000/developers').then(function (res) {
      expect(res.headers['x-xss-protection']).to.equal('1');
      expect(res.headers['x-content-type-options']).to.equal('nosniff');
      expect(res.headers['x-frame-options']).to.equal('deny');
      expect(res.headers['strict-transport-security']).to.equal(
        'max-age=86400; includeSubDomains'
      );
      expect(res.headers['content-security-policy']).to.be.undefined;
    });
  });
});

describe('/ping', () => {
  before(function (done) {
    init(done);
  });

  after(cleanup);

  it('should return a 200', () => {
    return axios.get('http://localhost:4000/ping').then(function (res) {
      expect(res.status).to.equal(200);
    });
  });
});

describe('/metrics', () => {
  const TOKEN = 'abc123';
  let i = 0;

  beforeEach(function (done) {
    customEnv.PROMETHEUS_TOKEN = i === 3 ? '' : TOKEN;
    init(done);
    i++;
  });

  afterEach(cleanup);

  it('should return a 404 if the bearer token doesnt match', () => {
    return axios
      .get('http://localhost:4000/metrics', {
        headers: { Authorization: 'Bearer: invalid' },
      })
      .catch(function (err) {
        expect(err.response.status).to.equal(404);
      });
  });

  it('should return a 404 if the bearer token doesnt exist', () => {
    return axios
      .get('http://localhost:4000/metrics', { headers: {} })
      .catch(function (err) {
        expect(err.response.status).to.equal(404);
      });
  });

  it('should return a 200 if PROMETHEUS_TOKEN is valid', () => {
    return axios
      .get('http://localhost:4000/metrics', {
        headers: { Authorization: `Bearer: ${TOKEN}` },
      })
      .then(function (res) {
        expect(res.status).to.equal(200);
        expect(res.data.includes('process_cpu_user_seconds_total')).to.be.true;
      });
  });

  it('should return a 404 if PROMETHEUS_TOKEN and bearer token are both empty strings', () => {
    return axios
      .get('http://localhost:4000/metrics', {
        headers: { Authorization: `Bearer: ` },
      })
      .catch(function (err) {
        expect(err.response.status).to.equal(404);
      });
  });
});

describe('Request for .html file', () => {
  before(function (done) {
    init(done);
  });

  after(cleanup);

  it('should return Cache-Control: no-cache', () => {
    return axios.get('http://localhost:4000/developers').then(function (res) {
      expect(res.headers['cache-control']).to.equal('no-cache');
    });
  });
});

describe('Request for asset file', () => {
  before(function (done) {
    init(done);
  });

  after(cleanup);

  it('should return Cache-Control with max age set to one year', () => {
    return axios
      .get('http://localhost:4000/developers/js/search.min.js')
      .then(function (res) {
        expect(res.headers['cache-control']).to.equal(
          'public, max-age=31536000'
        );
      });
  });
});
