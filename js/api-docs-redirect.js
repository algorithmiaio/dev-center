;(function redirectApiDocsHash() {
  if (window.location.pathname.match(/^\/developers\/api\/?$/) && window.location.hash) {
    switch(window.location.hash.toLowerCase()) {
      case '#introduction': window.location.assign('/developers/api')
    }
  }
})()
