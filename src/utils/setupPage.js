import { replaceUserCreds } from './replaceUserCreds'
import { showSearchPageIfQueryExists } from './lunr'

function enableNavButtons(authenticated) {
  const navClass = authenticated ? 'show-auth-nav' : 'show-unauth-nav'
  document.querySelector('.syn-page-header').classList.add(navClass)
}

export function setupPage(user) {
  enableNavButtons(!!user)

  showSearchPageIfQueryExists()

  replaceUserCreds({
    user,
    nodes: document.querySelectorAll('pre code')
  })
}
