export function redirectApiDocsHash() {
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
      case '#data-api-specification': return '/developers/api/data-api-specification'
      case '#data-uri':
      case '#directories':
      case '#listing-a-directory':
      case '#creating-a-directory':
      case '#updating-a-directory':
      case '#deleting-a-directory':
      case '#files':
      case '#getting-a-file':
      case '#check-if-file-exists':
      case '#upload-a-file':
      case '#deleting-a-file': return `/developers/api/data-api-specification${hash}`
      case '#api-versioning': return '/developers/api/api-versioning'
      case '#clients': return '/developers/api/clients'
      case '#algorithm-development': return '/developers/api/algorithm-development'
      case '#need-help': return '/developers/api/need-help'
      case '#connect-with-us':
      case '#contribute-to-the-docs': return `/developers/api/need-help${hash}`
      default: return undefined
    }
  }

  if (window.location.pathname.match(/^\/developers\/api\/?$/)
    && window.location.hash
    && getRedirectRoute(window.location.hash)) {
    window.location.assign(getRedirectRoute(window.location.hash))
  }
}
