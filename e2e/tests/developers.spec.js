const assert = require("assert")
const { isEquivalent } = require("../utilities/url")
const page = require("../pages/developerCenter")
const gettingStartedPage = require("../pages/gettingStarted")
const modelGuidesPage = require("../pages/modelGuides")
const { E2E_BASE_URL, IS_RUNNING_E2E_LOCALLY } = require("../config")

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
    it('Should display search results if search query exists in URL', () => {

    })

    it('Should update search results when search input is updated', () => {

    })

    it('Should allow filtering by API Docs', () => {

    })

    it('Should show "No Results" if no resuls are found', () => {

    })

    it('Should not show search results if no query param is present on page load', () => {

    })

    it('Should not show search results if search input is empty', () => {

    })
  })

  describe('Side Nav', () => {
    it('Should be expanded by default', () => {

    })

    it('Should be collapsable', () => {

    })

    it('should contain section for API docs', () => {

    })

    it('should contain section for Documentation', () => {

    })

    it('should allow navigation to pages', () => {

    })

    it('Should persist collapsed state on page reload', () => {

    })
  })

  describe('Language Preference', () => {
    it('should be able to update language in code snippets', () => {

    })

    it('should update language in other code snippets when language is updated', () => {

    })

    it('should persist preferred language on page refresh', () => {

    })

    it('should not update language in code snippets that dont support that language', () => {

    })
  })

  describe('API docs', () => {
    it('should render', () => {

    })
  })

  // describe("Landing page", () => {
  //   it("should show the landing page", () => {
  //     page.open()
  //     assert.equal(page.header.getText(), "Developer Center")
  //   })

  //   it("should display search results", () => {
  //     page.open()
  //     browser.pause(5000) // wait for jQuery to initialize
  //     page.searchFor("getting started")
  //     page.pageTitle.waitForExist()
  //     const firstResultText = page.firstSearchResult.getText()
  //     const searchResultIsRelevant = /getting started/i.test(firstResultText)
  //     assert.equal(searchResultIsRelevant, true)
  //   })

  //   it("should contain sidenav with expandable items", () => {
  //     page.open()
  //     page.clientGuidesListItem.click()
  //     assert.equal(page.clientGuidesList.isDisplayed(), true)
  //   })

  //   it("should contain sidenav with expandable items", () => {
  //     page.open()
  //     page.clientGuidesListItem.click()
  //     assert.equal(page.clientGuidesList.isDisplayed(), true)
  //   })

  //   it("should allow navigation to side nav pages", () => {
  //     page.open()
  //     page.clientGuidesListItem.click()
  //     page.curlGuideListItem.click()
  //     const expectedUrl = `${E2E_BASE_URL}/developers/clients/curl/`
  //     browser.waitForUrl(expectedUrl)
  //     assert(isEquivalent(browser.getUrl(), expectedUrl))
  //   })
  // })

  describe("Getting started page", () => {
    it("should show toast notification when you copy text", () => {
      assert.equal(gettingStartedPage.toastMessage.isExisting(), false)
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

    it("allows you to select languages", () => {
      gettingStartedPage.open()
      gettingStartedPage.languageSelector.scrollIntoView({
        block: "center"
      })
      assert.equal(gettingStartedPage.selectedLanguage, "python")

      gettingStartedPage.javaOption.click()
      assert.equal(gettingStartedPage.selectedLanguage, "java")
    })

    describe('logged in', () => {
      it('should replace all cases of YOUR_USERNAME within code snippets', () => {

      })

      it('should replace all cases of YOUR_API_KEY within code snippets', () => {

      })

      it('should not replace YOUR_USERNAME in text outside of code snippets', () => {

      })

      it('should not replace YOUR_API_KEY in text outside of code snippets', () => {

      })
    })
  })

})
