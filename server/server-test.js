const express = require("express");
const path = require("path");
const querystring = require("querystring");
const Bunyan = require("bunyan");
const config = require("../config");
const prometheus = require("prom-client");
const { monitor } = require("./prometheus");

const log = Bunyan.createLogger({ name: "dev-center-server" });
const app = express();

prometheus.collectDefaultMetrics();
monitor.routes(app);

const isProduction = process.env.NODE_ENV === "production";

log.info("Starting server");

// API Docs - resolve before trailing slash redirect so assets don't break

if (isProduction) {
  app.use(
    "/developers/api",
    express.static(path.join(__dirname, "../docs/"), {
      redirect: false
    })
  );
} else {
  app.use(
    "/developers/api/",
    require("http-proxy-middleware")({
      target: config.env.stage.apiDocsUrl,
      pathRewrite: {'^/developers/api/' : ''},
    })
  );
}

// const hasTrailingSlash = reqPath => /.+\/$/.test(reqPath);
// const isApiDocs = reqPath => /^\/developers\/api\/?$/.test(reqPath);
// app.get("*", (req, res, next) => {
//   if (hasTrailingSlash(req.path) && !(!isProduction || isApiDocs(req.path))) {
//     res.redirect(req.path.replace(/\/$/, ""));
//   } else if (
//     !hasTrailingSlash(req.path) &&
//     (!isProduction || isApiDocs(req.path))
//   ) {
//     res.redirect(`${req.path}/`);
//   } else {
//     next();
//   }
// });

if (!isProduction) {
  app.use(
    require("http-proxy-middleware")({
      // target: config.env.stage.devCenterUrl,
      target: 'http://0.0.0.0:4001',
      changeOrigin: true
    })
  );
}
// Initialization

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  log.info(`Server started on port ${PORT}.`);
});

monitor.server(server);

// Graceful Shutdown

function gracefulShutdown() {
  console.log("Received signal, shutting down gracefully.");

  server.close(() => {
    console.log("Closed out remaining connections.");
    process.exit();
  });

  const gracePeriod = isProduction ? 10 : 1;

  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit();
  }, gracePeriod * 1000);
}

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
