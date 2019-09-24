;(async function replaceUserCreds() {
  function traverseNodeChildren(node, callback) {
    if (!node.childNodes.length) {
      callback(node)
    }

    for (const child of node.childNodes) {
      traverseNodeChildren(child, callback)
    }
  }

  function replaceTextContent(node, replacers) {
    const isTextNode = n => n.nodeType === Node.TEXT_NODE

    traverseNodeChildren(node, (child) => {
      if (isTextNode(child)) {
        child.textContent = replacers.reduce(
          (text, replace) => replace(text),
          child.textContent
        )
      }
    })
  }

  function updateUserCreds(username, apiKey = 'YOUR_API_KEY') {
    const codeExampleNodes = document.querySelectorAll(
      '[ng-controller=GettingStartedControl]'
    )

    if (!codeExampleNodes.length) return

    const replacers = [
      str => str.replace(/YOUR_USERNAME/g, username),
      str => str.replace(/YOUR_API_KEY/g, apiKey)
    ]

    codeExampleNodes.forEach(node => {
      replaceTextContent(node, replacers)
    })
  }

  async function getCurrentUser() {
    const response = await fetch('/webapi/user', {
      headers: {
        accept: 'application/json, text/plain, */*',
      }
    })

    const { user } = await response.json()
    return user
  }

  try {
    const { username, default_api_key: apiKey } = await getCurrentUser()

    if (username) {
      updateUserCreds(username, apiKey)
    }
  } catch (err) {
    // User is logged out. Safe to ignore error since this is an enhancement
    // and the page is perfectly useable without credentials replaced.
  }
})()
