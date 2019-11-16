const express = require('express')
const axios = require('axios')
const path = require('path')
const querystring = require('querystring')
const Bunyan = require('bunyan')
const config = require('../config')
const prometheus = require('prom-client')
const { monitor } = require('./prometheus')
const { renderCustomizationScript } = require('./customization')

const log = Bunyan.createLogger({ name: 'dev-center-server' })
const app = express()

const metricsInterval = prometheus.collectDefaultMetrics()
monitor.routes(app)

const isProduction = process.env.NODE_ENV === 'production'

log.info('Starting server')

const customizationValues = {}
const loadCustomizationValues = async () => {
  try {
    const { data: frontendConfigResponse } = await axios.get(
      `${config.env.stage.webapiUrl}/v1/config/frontend`
    )

    frontendConfigResponse.results.forEach(r => {
      if (r.keyname === 'brandTitle') customizationValues.brandTitle = r.value
      if (r.keyname === 'brandColor') customizationValues.brandColor = r.value
      if (r.keyname === 'siteTitle') customizationValues.siteTitle = r.value
    })
  } catch (err) {
    log.warn(`Unable to load customization values! ${err.message}`)
  }
}

// Add security headers to all responses
app.use((req, res, next) => {
  if (!config.env.disableXXSSProtection) {
    res.setHeader('X-XSS-Protection', 1)
  }
  if (!config.env.disableXContentTypeOptions) {
    res.setHeader('X-Content-Type-Options', 'nosniff')
  }
  if (!config.env.disableXFrameOptions) {
    res.setHeader('X-Frame-Options', 'deny')
  }
  if (!config.env.disableHSTS) {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=86400; includeSubDomains'
    )
  }
  if (config.env.stage.cspEnabled) {
    const cdn = 'cdn.algorithmia.com'
    // No convenient way to hook into these dynamically. If adding an inline
    // script, a new CSP SHA will have to be added manually here.
    // Chrome will tell you which SHA it expects if you have any CSP errors,
    // so you don't have to calculate them yourself.
    const cspShas = [
      // The inline script in _layouts/default.html where Lunr is initialized.
      'WmaB/BZsNpo2j+CMricdhZ2p4mn+Q54VCeUr3ceYLFA='
    ]
    res.setHeader(
      'Content-Security-Policy',
      [
        `default-src 'self'`,
        `img-src ${cdn} 'self'`,
        `style-src ${cdn} 'unsafe-inline' 'self'`,
        `script-src ${cspShas
          .map(sha => `'sha256-${sha}'`)
          .join(' ')} ${cdn} 'self'`,
        `frame-src https://www.youtube.com 'self'`,
      ].join(';')
    )
  }
  next()
})

// Kubernetes readiness probe

app.use('/ping', (req, res) => {
  res.status(200).end('ok')
})

// Prometheus

app.get('/metrics', (req, res, next) => {
  const auth = req.headers.authorization || ''
  const segments = auth.split(' ')
  const expectedToken = config.env.stage.prometheusToken

  // In addition to checking that the tokens match, we also check that the
  // token has been set in the env. This lets us prevent a case where the
  // token is an empty string and the user gains access by submitting an
  // empty bearer token.
  if (expectedToken && segments.length === 2 && segments[1] === expectedToken) {
    res.set('Content-Type', prometheus.register.contentType)
    res.end(prometheus.register.metrics())
  } else {
    next()
  }
})

// Log all requests, but ignore Kubernetes and Prometheus requests for waaaaaay
// less noise.

app.use((req, res, next) => {
  log.info(`${req.method} ${req.originalUrl}`, req.headers)
  next()
})

app.get('/developers/userCustomizations.js', (req, res) => {
  res.set('Content-Type', 'application/javascript')
  res.set('Cache-Control', 'public, max-age=86400') // 1 day
  res.status(200).send(renderCustomizationScript(customizationValues))
})

// Remove trailing slashes, UNLESS we're in local dev mode,
// in which case we need the slashes to communicate with the Jekyll server,
// so we ensure trailing slash is there
const hasTrailingSlash = reqPath => /.+\/$/.test(reqPath)
const isFile = reqPath => /\.\w+$/.test(reqPath)
app.get('*', (req, res, next) => {
  if (hasTrailingSlash(req.path) && isProduction) {
    res.redirect(req.path.replace(/\/$/, ''))
  } else if (
    !hasTrailingSlash(req.path) &&
    !isFile(req.path) &&
    !isProduction
  ) {
    res.redirect(`${req.path}/`)
  } else {
    next()
  }
})

// Local Development - Proxy requests to local hot-reloading Jekyll server

if (!isProduction) {
  const devCenterProxyConfig = {
    target: config.env.stage.devCenterUrl,
    changeOrigin: true
  }
  app.use(require('http-proxy-middleware')(devCenterProxyConfig))
}

// Dev Center

const isDirectory = devCenterPath => !/\w+\.\w+$/.test(devCenterPath)
app.use(/^\/developers/, (req, res, next) => {
  const usePublic = req.headers['x-public-marketplace-documentation'] === 'true'

  if (isDirectory(req.path)) {
    const qs = querystring.stringify(req.query)
    const newPath = `${req.path.replace(/\/$/, '')}/index.html`
    const newQs = qs ? `?${qs}`: ''
    req.url = `${newPath}${newQs}`
  }

  const options = {
    redirect: false,
    setHeaders: (res, filepath) => {
      res.set(
        'cache-control',
        (filepath.endsWith('.html') || !isProduction) ? 'no-cache' : 'public, max-age=31536000'
      )
    }
  }

  const basePath = path.join(
    __dirname,
    `../sites/${usePublic ? 'public' : 'enterprise'}`,
    'developers'
  )

  express.static(basePath, options)(req, res, () => {
    // If by this point we are still unable to discover a resource,
    // lovingly return a 404 page to the user.
    res.status(404).sendFile(`${basePath}/404.html`)
  })
})

// Initialization

loadCustomizationValues()
const refreshCustomizationInterval = setInterval(loadCustomizationValues, 10000)

const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => {
  log.info(`Server started on port ${PORT}.`)
})

monitor.server(server)

// Graceful Shutdown

function gracefulShutdown() {
  console.log('Received signal, shutting down gracefully.')

  server.close(() => {
    console.log('Closed out remaining connections.')
    process.exit()
  })

  clearInterval(metricsInterval)
  clearInterval(refreshCustomizationInterval)
  const gracePeriod = isProduction ? 10 : 1

  setTimeout(() => {
    console.error(
      'Could not close connections in time, forcefully shutting down'
    )
    process.exit()
  }, gracePeriod * 1000)
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
