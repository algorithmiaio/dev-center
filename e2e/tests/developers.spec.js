const assert = require("assert")
const { isEquivalent } = require("../utilities/url")
const page = require("../pages/developerCenter")
const gettingStartedPage = require("../pages/gettingStarted")
const modelGuidesPage = require("../pages/modelGuides")
const apiDocsPage = require("../pages/apiDocs")
const searchPage = require("../pages/search")
const dataPage = require("../pages/data")
const { E2E_BASE_URL, IS_RUNNING_E2E_LOCALLY } = require("../config")
const auth = require('../utilities/auth')
const { platformUser } = require('../utilities/platform')

const { username } = platformUser

describe("Developer Center", () => {
  describe("Deployment redirect", () => {
    before(function() {
      // When running locally, the redirect is generated using the port Jekyll
      // knows about, not the one used by Express.
      if (IS_RUNNING_E2E_LOCALLY) {
        this.skip()
      }
    })

    it("should redirect to model-deployment url", () => {
      modelGuidesPage.open()
      browser.waitUntil(() =>
        isEquivalent(browser.getUrl() || "", modelGuidesPage.redirectPath)
      )
      assert.equal(
        isEquivalent(browser.getUrl() || "", modelGuidesPage.redirectPath),
        true
      )
    })
  })

  describe('Search Results', () => {
    it('should display search term in header', () => {
      searchPage.open('curl')
      browser.waitUntil(() =>
        searchPage.header.getText() === 'Search results for "curl"'
      )
      assert.equal(searchPage.header.getText(), 'Search results for "curl"')
    })

    it('should display search results if search query exists in URL', () => {
      searchPage.open('curl')
      browser.waitUntil(() => searchPage.searchResults.isDisplayed())
      assert(!searchPage.noResultsMessage.isDisplayed())
      assert(searchPage.searchResults.isDisplayed())
    })

    it('should update search results when search input is updated', () => {
      searchPage.open('curl')
      browser.waitUntil(() => searchPage.searchResults.isDisplayed())
      const initialResults = searchPage.searchResults.getText()
      browser.pause(1000)
      searchPage.searchFor('javascript')
      browser.waitUntil(() => searchPage.searchResults.getText() !== initialResults)
      assert(initialResults !== searchPage.searchResults.getText())
    })

    it('should allow filtering by API Docs', () => {
      searchPage.open('curl')
      browser.waitUntil(() => searchPage.searchResults.isDisplayed())
      const initialResults = searchPage.searchResults.getText()
      searchPage.searchFilter.click()
      searchPage.apiDocsFilterOption.click()
      browser.waitUntil(() => searchPage.searchResults.getText() !== initialResults)
      assert(initialResults !== searchPage.searchResults.getText())
    })

    it('should show "No Results" if no resuls are found', () => {
      searchPage.open('dsfjaslfajsflsafnasdf')
      browser.waitUntil(() => searchPage.noResultsMessage.isDisplayed())
      assert(searchPage.noResultsMessage.isDisplayed())
    })

    it('should not show search results if no query param is present on page load', () => {
      page.open()
      assert(!searchPage.noResultsMessage.isDisplayed())
      assert(!searchPage.searchResults.isDisplayed())
    })
  })

  describe('Side Nav', () => {
    it('should be expanded by default', () => {
      page.open()
      assert(page.isSideNavOpen)
    })

    it('should contain section for API docs', () => {
      page.open()
      browser.waitUntil(() => page.isSideNavOpen)
      assert(page.apiDocsMenuSection.isDisplayed())
    })

    it('should contain section for Documentation', () => {
      page.open()
      browser.waitUntil(() => page.isSideNavOpen)
      assert(page.devCenterMenuSection.isDisplayed())
    })

    it('should allow navigation to pages', () => {
      page.open()
      browser.waitUntil(() => page.isSideNavOpen)
      page.apiDocsMenuSection.click()
      browser.waitUntil(() => page.apiDocsHomeLink.isDisplayed())
      page.apiDocsHomeLink.click()
      const expectedUrl = `${E2E_BASE_URL}/developers/api`
      browser.waitForUrl(expectedUrl)
      assert(isEquivalent(browser.getUrl(), expectedUrl))
    })

    it('should persist collapsed state on page reload', () => {
      page.open()
      page.hamburgerMenu.click()
      browser.refresh()
      browser.waitUntil(() => page.isSideNavOpen)
      assert(page.isSideNavOpen)
    })
  })

  describe('Language Preference', () => {
    beforeEach(() => {
      browser.deleteAllCookies()
    })

    it("should allow you to select languages", () => {
      gettingStartedPage.open()
      gettingStartedPage.languageSelector.scrollIntoView({ block: "center" })
      assert.equal(gettingStartedPage.selectedLanguage, "python")
      gettingStartedPage.javaOption.click()
      assert.equal(gettingStartedPage.selectedLanguage, "java")
    })

    it('should update language in other code snippets when language is updated', () => {
      dataPage.open()
      dataPage.secondCodeExample.scrollIntoView({ block: "center" })
      assert.equal(dataPage.secondCodeSelectedLanguage, 'Shell')
      dataPage.firstCodeExample.scrollIntoView({ block: "center" })
      assert.equal(dataPage.firstCodeSelectedLanguage, "Shell")
      dataPage.nodeOption.click()
      assert.equal(dataPage.firstCodeSelectedLanguage, 'Node')
      dataPage.secondCodeExample.scrollIntoView({ block: "center" })
      assert.equal(dataPage.secondCodeSelectedLanguage, 'Node')
    })

    it('should persist preferred language on page refresh', () => {
      dataPage.open()
      dataPage.firstCodeExample.scrollIntoView({ block: "center" })
      assert.equal(dataPage.firstCodeSelectedLanguage, "Shell")
      dataPage.nodeOption.click()
      assert.equal(dataPage.firstCodeSelectedLanguage, 'Node')
      browser.refresh()
      dataPage.firstCodeExample.scrollIntoView({ block: "center" })
      assert.equal(dataPage.firstCodeSelectedLanguage, 'Node')
    })
  })

  describe('API docs', () => {
    it('should render', () => {
      apiDocsPage.open()
      assert.equal(apiDocsPage.header.getText(), "API Documentation")
    })
  })

  describe("Landing page", () => {
    it("should render", () => {
      page.open()
      assert.equal(page.header.getText(), "Home")
    })
  })

  describe("Getting started page", () => {
    it("should show toast notification when you copy text", () => {
      gettingStartedPage.open()
      gettingStartedPage.firstCodeExampleCopyIcon.scrollIntoView({
        block: "center"
      })
      gettingStartedPage.firstCodeExampleCopyIcon.click()
      assert.equal(gettingStartedPage.toastMessage.isExisting(), true)
    })

    it("should show YOUR_USERNAME and YOUR_API_KEY in examples if logged out", () => {
      gettingStartedPage.open()
      gettingStartedPage.secondCodeExampleCodePane.scrollIntoView({
        block: "center"
      })
      const codeText = gettingStartedPage.secondCodeExampleCodePane.getText()
      assert.equal(codeText.includes("YOUR_USERNAME"), true)
      assert.equal(codeText.includes("YOUR_API_KEY"), true)
    })

    describe('logged in', () => {
      before(function() {
        // If running locally, we won't have the ability to log in.
        // This is only possible in test and prod envs.
        if (IS_RUNNING_E2E_LOCALLY) {
          this.skip()
        } else {
          auth.signIn()
        }
      })

      it('should replace credentials within code snippets', () => {
        gettingStartedPage.open()
        gettingStartedPage.secondCodeExampleCodePane.scrollIntoView({ block: "center" })
        const codeText = gettingStartedPage.secondCodeExampleCodePane.getText()
        assert.equal(codeText.includes(username), true)
        assert.equal(codeText.includes("YOUR_USERNAME"), false)
      })

      it('should not replace YOUR_USERNAME in text outside of code snippets', () => {
        gettingStartedPage.open()
        gettingStartedPage.notice.scrollIntoView({ block: "center" })
        const text = gettingStartedPage.notice.getText()
        assert(text.includes("YOUR_USERNAME"))
        assert(!text.includes(username))
      })
    })
  })
})
