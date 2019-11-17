import { replaceUserCreds } from './replaceUserCreds'

function enableNavButtons(authenticated) {
  const navClass = authenticated ? 'show-auth-nav' : 'show-unauth-nav'
  document.querySelector('.syn-page-header').classList.add(navClass)
}

export function setupPage(user) {
  enableNavButtons(!!user)

  console.log('USER', user)

  replaceUserCreds({
    user,
    nodes: document.querySelectorAll('pre code')
  })
}
