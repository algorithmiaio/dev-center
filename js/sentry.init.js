window.Sentry && Sentry.init({
  dsn: 'https://f918b2f372cb41018233ed3cd8e3fa37@sentry.io/1788379',
  environment: window.location.hostname,
  beforeBreadcrumb: (breadcrumb) => {
    const { category, data } = breadcrumb

    if (category === 'xhr') {
      data.url = '[REDACTED]'
    }

    return breadcrumb
  },
});
