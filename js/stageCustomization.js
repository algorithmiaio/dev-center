;(async function replaceSiteTitle() {
  async function getStageCustomization() {
    const response = await fetch('/v1/config/frontend', {
      headers: {
        accept: 'application/json, text/plain, */*',
      },
    })

    const customizationInfo = await response.json()
    return customizationInfo.results
  }

  function setBrandTitle(customizationVals) {
    const brandTitle = customizationVals.find(
      val => val.keyname === 'brandTitle'
    )
    document.getElementById('brand-title').innerText =
      brandTitle.value || 'AI LAYER'
    if (brandTitle.value) {
      document
        .getElementById('brand-title')
        .classList.remove('syn-hidden-lg', 'syn-hidden-md', 'syn-hidden-sm')
      document
        .getElementById('before-brand-title')
        .classList.remove('syn-hidden-lg', 'syn-hidden-md', 'syn-hidden-sm')
    }
  }

  try {
    const customizationVals = await getStageCustomization()

    setBrandTitle(customizationVals)
  } catch (err) {
    // If we can't get customization values, leave brand title as is.
  }
})()
