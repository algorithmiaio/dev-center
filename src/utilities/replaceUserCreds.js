// Search page content for these strings to replace credentials.
const placeholder = {
  USERNAME: 'YOUR_USERNAME',
  API_KEY: 'YOUR_API_KEY'
}

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

export function replaceUserCreds({ nodes = [], user = null } = {}) {
  if (!nodes.length || !user) return

  const {
    username,
    default_api_key: apiKey = placeholder.API_KEY
  } = user

  const replacers = [
    str => str.replace(new RegExp(placeholder.USERNAME, 'g'), username),
    str => str.replace(new RegExp(placeholder.API_KEY, 'g'), apiKey)
  ]

  nodes.forEach(n => replaceTextContent(n, replacers))
}
