// Dynamically create a script using the current values given by the frontend
// config API. Generated server side so we can render faster on the client
// without waiting for an API request to finish.
function renderCustomizationScript({ siteTitle = '', brandTitle = '', brandColor = '' } = {}) {
  return `
    function applyCustomizations() {
      const vueContainer = document.getElementById('vue-app')
      if (!vueContainer) return

      if ('${siteTitle}') {
        document.title = '${siteTitle}'
      }

      const brandTitleElem = document.getElementById('brand-title')
      if (brandTitleElem && '${brandTitle}') {
        brandTitleElem.innerText = '${brandTitle}'
      }

      const header = document.querySelector('.syn-page-header-content')
      if (header && '${brandColor}') {
        header.style.backgroundColor = '${brandColor}'.startsWith('#')
          ? '${brandColor}'
          : '#${brandColor}'
      }

      vueContainer.classList.remove('js-only-initial-hide')
    }

    if (/complete|interactive|loaded/.test(document.readyState)) {
      applyCustomizations()
    } else {
      document.addEventListener('DOMContentLoaded', applyCustomizations)
    }
  `
}

module.exports = {
  renderCustomizationScript,
}
