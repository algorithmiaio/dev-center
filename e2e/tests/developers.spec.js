const assert = require('assert')
const auth = require('../utilities/auth')
const { isEquivalent } = require('../utilities/url')
const page = require('../pages/developerCenter')
const gettingStartedPage = require('../pages/gettingStarted')
const modelGuidesPage = require('../pages/modelGuides')
const { E2E_BASE_URL, USERNAME } = require('../config')

describe('Developer Center', () => {
  describe('Deployment redirect', () => {
    it('should redirect to model-deployment url', () => {
      modelGuidesPage.open()
      browser.waitForUrl(modelGuidesPage.redirectUrl)
      assert.equal(browser.getUrl(), modelGuidesPage.redirectUrl)
    })
  })

  describe('Landing page', () => {
    it('should show the landing page', () => {
      page.open()
      assert.equal(page.header.getText(), 'Developer Center')
    })

    it('should display search results', () => {
      page.open()
      browser.pause(5000) // wait for jQuery to initialize
      page.searchFor('getting started')
      page.pageTitle.waitForExist()
      const firstResultText = page.firstSearchResult.getText()
      const searchResultIsRelevant = /getting started/i.test(firstResultText)
      assert.equal(searchResultIsRelevant, true)
    })

    it('should contain sidenav with expandable items', () => {
      page.open()
      page.clientGuidesListItem.click()
      assert.equal(page.clientGuidesList.isDisplayed(), true)
    })

    it('should contain sidenav with expandable items', () => {
      page.open()
      page.clientGuidesListItem.click()
      assert.equal(page.clientGuidesList.isDisplayed(), true)
    })

    it('should allow navigation to side nav pages', () => {
      page.open()
      page.clientGuidesListItem.click()
      page.curlGuideListItem.click()
      const expectedUrl = `${E2E_BASE_URL}/developers/clients/curl/`
      browser.waitForUrl(expectedUrl)
      assert(isEquivalent(browser.getUrl(), expectedUrl))
    })
  })

  describe('Getting started page', () => {
    it('should show toast notification when you copy text', () => {
      assert.equal(gettingStartedPage.toastMessage.isExisting(), false)
      gettingStartedPage.open()
      gettingStartedPage.firstCodeExampleCopyIcon.scrollIntoView({
        block: 'center',
      })
      gettingStartedPage.firstCodeExampleCopyIcon.click()
      assert.equal(gettingStartedPage.toastMessage.isExisting(), true)
    })

    it('should show YOUR_USERNAME and YOUR_API_KEY in examples if logged out', () => {
      gettingStartedPage.open()
      gettingStartedPage.secondCodeExampleCodePane.scrollIntoView({
        block: 'center',
      })
      const codeText = gettingStartedPage.secondCodeExampleCodePane.getText()
      assert.equal(codeText.includes('YOUR_USERNAME'), true)
      assert.equal(codeText.includes('YOUR_API_KEY'), true)
    })

    it('should show message if user hovers over YOUR_USERNAME', () => {
      gettingStartedPage.open()
      gettingStartedPage.secondCodeExampleCodePane.scrollIntoView({
        block: 'center',
      })
      assert.equal(gettingStartedPage.usernameHoverMessage.isDisplayed(), false)
      gettingStartedPage.usernamePlaceholder.click()
      gettingStartedPage.usernameHoverMessage.waitForDisplayed()
      assert.equal(gettingStartedPage.usernameHoverMessage.isDisplayed(), true)
    })

    it('should show message if user hovers over YOUR_API_KEY', () => {
      gettingStartedPage.open()
      gettingStartedPage.secondCodeExampleCodePane.scrollIntoView({
        block: 'center',
      })
      assert.equal(gettingStartedPage.apiKeyHoverMessage.isDisplayed(), false)
      gettingStartedPage.apiKeyPlaceholder.click()
      gettingStartedPage.apiKeyHoverMessage.waitForDisplayed()
      assert.equal(gettingStartedPage.apiKeyHoverMessage.isDisplayed(), true)
    })

    it('allows you to select languages', () => {
      const containsJavaCode = text => text.includes('System.out.println')
      gettingStartedPage.open()
      gettingStartedPage.languageToggleButton.scrollIntoView({
        block: 'center',
      })
      assert.equal(gettingStartedPage.selectedLanguage.getText(), 'Python')
      assert.equal(
        containsJavaCode(gettingStartedPage.languageCodeBlock.getText()),
        false
      )
      gettingStartedPage.languageToggleButton.click()
      gettingStartedPage.javaLanguageOption.click()
      assert.equal(gettingStartedPage.selectedLanguage.getText(), 'Java')
      assert.equal(
        containsJavaCode(gettingStartedPage.languageCodeBlock.getText()),
        true
      )
    })

    describe('authenticated routes', () => {
      before(() => {
        auth.signIn()
      })

      it('should show user credentials instead of placeholders if logged in', () => {
        gettingStartedPage.open()
        gettingStartedPage.secondCodeExampleCodePane.scrollIntoView({
          block: 'center',
        })
        const codeText = gettingStartedPage.secondCodeExampleCodePane.getText()
        assert.equal(codeText.includes('YOUR_USERNAME'), false)
        assert.equal(codeText.includes('YOUR_API_KEY'), false)
        assert.equal(codeText.includes(USERNAME), true)
      })

      it('should show message if user hovers over YOUR_USERNAME', () => {
        gettingStartedPage.open()
        gettingStartedPage.secondCodeExampleCodePane.scrollIntoView({
          block: 'center',
        })
        assert.equal(
          gettingStartedPage.usernameHoverMessage.isDisplayed(),
          false
        )
        gettingStartedPage.usernamePlaceholder.click()
        gettingStartedPage.usernameHoverMessage.waitForDisplayed()
        assert.equal(
          gettingStartedPage.usernameHoverMessage.isDisplayed(),
          true
        )
      })

      it('should show message if user hovers over YOUR_API_KEY', () => {
        gettingStartedPage.open()
        gettingStartedPage.secondCodeExampleCodePane.scrollIntoView({
          block: 'center',
        })
        assert.equal(gettingStartedPage.apiKeyHoverMessage.isDisplayed(), false)
        gettingStartedPage.apiKeyPlaceholder.click()
        gettingStartedPage.apiKeyHoverMessage.waitForDisplayed()
        assert.equal(gettingStartedPage.apiKeyHoverMessage.isDisplayed(), true)
      })
    })
  })
})
