const express = require('express');
const path = require('path');
const querystring = require('querystring');
const Bunyan = require('bunyan');
const config = require('../config');
const prometheus = require('prom-client');
const { monitor } = require('./prometheus');

const log = Bunyan.createLogger({ name: 'dev-center-server' });
const app = express();

prometheus.collectDefaultMetrics();
monitor.routes(app);

const isProduction = process.env.NODE_ENV === 'production';

log.info('Starting server');

// Add security headers to all responses
app.use((req, res, next) => {
  if (!config.env.disableXXSSProtection) {
    res.setHeader('X-XSS-Protection', 1);
  }
  if (!config.env.disableXContentTypeOptions) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
  if (!config.env.disableXFrameOptions) {
    res.setHeader('X-Frame-Options', 'deny');
  }
  if (!config.env.disableHSTS) {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=86400; includeSubDomains'
    );
  }
  if (config.env.stage.cspEnabled) {
    const cdn = 'cdn.algorithmia.com';
    // No convenient way to hook into these dynamically. If adding an inline
    // script, a new CSP SHA will have to be added manually here.
    // Chrome will tell you which SHA it expects if you have any CSP errors,
    // so you don't have to calculate them yourself.
    const cspShas = [
      // The inline script in _layouts/default.html where Lunr is initialized.
      'WmaB/BZsNpo2j+CMricdhZ2p4mn+Q54VCeUr3ceYLFA=',
    ];
    res.setHeader(
      'Content-Security-Policy',
      [
        `default-src 'self'`,
        `img-src ${cdn} 'self'`,
        `style-src ${cdn} 'unsafe-inline' 'self'`,
        `script-src ${cspShas
          .map((sha) => `'sha256-${sha}'`)
          .join(' ')} ${cdn} 'self'`,
        `frame-src https://www.youtube.com 'self'`,
      ].join(';')
    );
  }
  next();
});

// Kubernetes readiness probe

app.use('/ping', (req, res) => {
  res.status(200).end('ok');
});

// Prometheus

app.get('/metrics', async (req, res, next) => {
  const auth = req.headers.authorization || '';
  const segments = auth.split(' ');
  const expectedToken = config.env.stage.prometheusToken;

  // In addition to checking that the tokens match, we also check that the
  // token has been set in the env. This lets us prevent a case where the
  // token is an empty string and the user gains access by submitting an
  // empty bearer token.
  if (expectedToken && segments.length === 2 && segments[1] === expectedToken) {
    res.set('Content-Type', prometheus.register.contentType);
    res.end(await prometheus.register.metrics());
  } else {
    next();
  }
});

// Log all requests, but ignore Kubernetes and Prometheus requests for waaaaaay
// less noise.

app.use((req, res, next) => {
  log.info(`${req.method} ${req.originalUrl}`, req.headers);
  next();
});

// Remove trailing slashes, UNLESS
// A) We're in local dev mode, in which case we need the slashes to communicate with the Jekyll server
// B) Request is for an API docs landing, which needs the slash to not break assets
// If A or B is true, ensure trailing slash is there
app.get('*', (req, res, next) => {
  const hasTrailingSlash = /.+\/$/.test(req.path);
  const isApiDocs = /^\/developers\/api\/?$/.test(req.path);
  const isAssetRequest = /\.\w+?$/.test(req.path);
  const needsTrailingSlash = (!isProduction || isApiDocs) && !isAssetRequest;

  if (hasTrailingSlash && !needsTrailingSlash) {
    res.redirect(req.path.replace(/\/$/, ''));
  } else if (!hasTrailingSlash && needsTrailingSlash) {
    res.redirect(`${req.path}/`);
  } else {
    next();
  }
});

// Local Development - Proxy requests to local hot-reloading Jekyll server

if (!isProduction) {
  app.use(
    require('http-proxy-middleware')({
      target: config.env.stage.devCenterUrl,
      changeOrigin: true,
    })
  );
}

// Dev Center

const isDirectory = (devCenterPath) => !/\w+\.\w+$/.test(devCenterPath);
app.use(/^\/developers/, (req, res, next) => {
  const usePublic =
    req.headers['x-public-marketplace-documentation'] === 'true';

  if (isDirectory(req.path)) {
    const qs = querystring.stringify(req.query);
    const newPath = `${req.path.replace(/\/$/, '')}/index.html`;
    const newQs = qs ? `?${qs}` : '';
    req.url = `${newPath}${newQs}`;
  }

  const options = {
    redirect: false,
    setHeaders: (res, filepath) => {
      res.set(
        'cache-control',
        filepath.endsWith('.html') || !isProduction
          ? 'no-cache'
          : 'public, max-age=31536000'
      );
    },
  };

  const basePath = path.join(
    __dirname,
    `../sites/${usePublic ? 'public' : 'enterprise'}`,
    'developers'
  );

  express.static(basePath, options)(req, res, () => {
    // If by this point we are still unable to discover a resource,
    // lovingly return a 404 page to the user.
    res.status(404).sendFile(`${basePath}/404.html`);
  });
});

// Initialization

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  log.info(`Server started on port ${PORT}.`);
});

monitor.server(server);

// Graceful Shutdown

function gracefulShutdown() {
  console.log('Received signal, shutting down gracefully.');

  server.close(() => {
    console.log('Closed out remaining connections.');
    process.exit();
  });

  const gracePeriod = isProduction ? 10 : 1;

  setTimeout(() => {
    console.error(
      'Could not close connections in time, forcefully shutting down'
    );
    process.exit();
  }, gracePeriod * 1000);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
