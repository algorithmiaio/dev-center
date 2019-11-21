const getContainerDimensions = (el) => {
  let containerRect
  try {
    const synPageContainer = document.querySelector('.syn-page-main')
    if (synPageContainer && synPageContainer.contains(el)) {
      containerRect = synPageContainer.getBoundingClientRect()
    }
  } finally {
    return {
      maxHeight: containerRect ? containerRect.bottom : window.innerHeight,
      minHeight: containerRect ? containerRect.top : 0,
      maxWidth: containerRect ? containerRect.right : window.innerWidth,
      minWidth: containerRect ? containerRect.left : 0,
    }
  }
}

export const repositionDropdownMenu = (menu) => {
  try {
    const menuRect = menu.getBoundingClientRect()
    const containerDimensions = getContainerDimensions(menu)

    if (menuRect.right > containerDimensions.maxWidth) {
      menu.style.left = `${containerDimensions.maxWidth - menuRect.right - 8}px`
      menu.style.right = 'auto'
    } else if (menuRect.left < containerDimensions.minWidth) {
      menu.style.right = `${menuRect.left - 8}px`
      menu.style.left = 'auto'
    }
    if (menuRect.bottom > containerDimensions.maxHeight) {
      menu.style.top = 'auto'
      menu.style.bottom = '100%'
    } else if (menuRect.top < containerDimensions.minHeight) {
      menu.style.top = '100%'
      menu.style.bottom = 'auto'
    }
  } finally {
    return
  }
}
