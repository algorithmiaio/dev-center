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
      case '#algorithm-management-api': return '/developers/api/algorithm-management-api'
      case '#create-an-algorithm':
      case '#update-an-algorithm':
      case '#recompile-your-algorithm':
      case '#get-list-of-algorithm-builds':
      case '#get-algorithm-build':
      case '#get-algorithm-build-logs':
      case '#publish-an-algorithm':
      case '#get-info-about-an-an-algorithm':
      case '#list-versions-of-an-algorithm': return `/developers/api/algorithm-management-api${hash}`
      default: return undefined
    }
  }

  if (window.location.pathname.match(/^\/developers\/api\/?$/)
    && window.location.hash
    && getRedirectRoute(window.location.hash)) {
    window.location.assign(getRedirectRoute(window.location.hash))
  }
})()
