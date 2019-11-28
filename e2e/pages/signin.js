const Page = require('./BasePage')

class SignInPage extends Page {
  get title() {
    return 'Sign In - Algorithmia'
  }

  get usernameInput() {
    return $('[data-e2e="signin-form-username"]')
  }

  get passwordInput() {
    return $('[data-e2e="signin-form-password"]')
  }

  get submitButton() {
    return $('[data-e2e="signin-form-submit"]')
  }

  get signupButton() {
    return $('[data-e2e="signup-button"]')
  }

  open() {
    return super.open('/signin')
  }

  loginWithCredentials(username, password) {
    this.usernameInput.setValue(username)
    this.passwordInput.setValue(password)
    this.submitButton.click()
  }
}

module.exports = new SignInPage()
