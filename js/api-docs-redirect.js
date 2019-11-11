;(function redirectApiDocsHash() {
  function getRedirectRoute(hash) {
    switch(hash) {
      case '#introduction': return '/developers/api'
      case '#authentication': return '/developers/api/authentication'
      case '#api-keys':
      case '#key-restrictions': return `/developers/api/authentication${hash}`
      case '#api-specification': return '/developers/api/api-specification'
      case '#call-an-algorithm':
      case '#input-output':
      case '#query-parameters':
      case '#error-handling': return `/developers/api/api-specification${hash}`
      default: return `/developers/api${hash}`
    }
  }

  if (window.location.pathname.match(/^\/developers\/api\/?$/) && window.location.hash) {
    window.location.assign(getRedirectRoute(window.location.hash))
  }
})()
