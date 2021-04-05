const prometheus = require('prom-client');
const requestStats = require('request-stats');

// No need to namespace these metric names.
// Prometheus adds a job label automatically, so clashes aren't a problem.
const metric = {
  HTTPRequestsTotal: 'http_requests_total',
  HTTPResponsesTotal: 'http_responses_total',
  HTTPInboundBytes: 'http_request_inbound_bytes_total',
  HTTPOutboundBytes: 'http_request_outbound_bytes_total',
  HTTPDurationSeconds: 'http_request_duration_seconds',
};

const requestCounter = new prometheus.Counter({
  name: metric.HTTPRequestsTotal,
  help: 'The number of HTTP requests received.',
  labelNames: ['method'],
});

const inboundByteCounter = new prometheus.Counter({
  name: metric.HTTPInboundBytes,
  help: 'The number of bytes received from the client.',
  labelNames: ['method'],
});

const outboundByteCounter = new prometheus.Counter({
  name: metric.HTTPOutboundBytes,
  help: 'The number of bytes sent back to the client.',
  labelNames: ['method'],
});

const responseTimeHistogram = new prometheus.Histogram({
  name: metric.HTTPDurationSeconds,
  help: 'The total time from a request received to response sent.',
  labelNames: ['method'],
});

const responseCounter = new prometheus.Counter({
  name: metric.HTTPResponsesTotal,
  help: 'The number of HTTP responses the app is serving',
  labelNames: ['method', 'status'],
});

function monitorRoutes(app) {
  app.use('*', (req, res, next) => {
    requestCounter.labels(req.method).inc();
    next();
  });
}

function monitorServer(server, stats) {
  // Allow stats to be passed for easier testing
  stats = stats || requestStats(server);

  // Ensure that metrics that look for 500 status codes return an initial count
  // of 0. Without setting this explicitly when the server is started,
  // 'undefined' is returned instead, causing the Grafana chart to display
  // 'No data' instead of a series of 0 values.
  responseCounter.labels('GET', '500').inc(0);

  stats.on('complete', ({ req, res, time: ms }) => {
    inboundByteCounter.labels(req.method).inc(req.bytes);
    outboundByteCounter.labels(req.method).inc(res.bytes);
    responseTimeHistogram.labels(req.method).observe(ms / 1000);
    responseCounter.labels(req.method, res.status).inc();
  });
}

const monitor = {
  routes: monitorRoutes,
  server: monitorServer,
};

module.exports = {
  metric,
  monitor,
};
