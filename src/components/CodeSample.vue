<template>
  <div class="syn-code-block">
    <div class="syn-code-block-header syn-flex justify-space-between align-center">
      <span class="syn-overline syn-text-light-primary syn-mb-0 syn-ml-16 syn-mr-8">{{title}}</span>
      <div class="syn-ma-8 syn-flex align-center">
        <select
          class="syn-code-language-selector syn-mr-8"
          v-if="languages.length > 1"
          :value="selectedLanguage"
          @change="onSelectChange($event.target.value)"
        >
          <option v-for="language in languages" :key="language" :value="language">
            {{ language }}
          </option>
        </select>
        <button class="syn-btn no-padding" @click="copySample" title="Copy">
          <i class="material-icons syn-ma-4">content_copy</i>
        </button>
      </div>
    </div>
    <div class="syn-code-block-body" ref="codeContent">
      <slot>
        <pre><code>// Sample Code Block
  console.log('Hello world!')</code></pre>
      </slot>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { copyToClipboard } from '../utilities/clipboard'
import { setCookieValue } from '../utilities/cookie'
import { Cookie } from '../enums/Cookie'

export default {
  name: 'CodeSample',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      languages: [],
      selectedLanguage: ''
    }
  },
  computed: mapGetters(['preferredLanguage']),
  methods: {
    copySample() {
      const copyText = this.$refs.codeContent.querySelector(`figure.${this.selectedLanguage}`).innerText
      copyToClipboard(copyText)
      this.$root.$emit('show-toast', 'Copied to clipboard!')
    },
    processLanguages() {
      const samples = this.$refs.codeContent.querySelectorAll('figure')
      const langs = []
      samples.forEach((sample) => {
        let sampleLang = ''
        if (sample.parentElement.getAttribute('code-sample-language')) {
          // First check if code-sample-language was specified and use that if it was
          sampleLang = sample.parentElement.getAttribute('code-sample-language')
        } else {
          // Otherwise default to the language specified on the highlight block
          const sampleCode = sample.querySelector('code')
          sampleLang = sampleCode.getAttribute('data-lang')
        }
        langs.push(sampleLang)
        sample.classList.add(sampleLang)
      })
      return langs
    },
    showSelectedLanguage() {
      const samples = this.$refs.codeContent.querySelectorAll('figure')
      samples.forEach((sample) => {
        if (sample.classList.contains(this.selectedLanguage)) {
          sample.hidden = false
        } else {
          sample.hidden = true
        }
      })
    },
    onSelectChange(newLanguage) {
      this.setLanguage(newLanguage)
      this.setPreferredLanguage(newLanguage)
      setCookieValue(
        Cookie.preferredLanguage,
        newLanguage,
        { path: '/', daysUntilExpire: 365 }
      )
    },
    setLanguage(newLanguage) {
      this.selectedLanguage = newLanguage
    },
    hasLanguage(language) {
      return this.languages.includes(language)
    },
    ...mapActions(['setPreferredLanguage'])
  },
  mounted() {
    // Wait to check for languages till mounted
    this.languages = this.processLanguages()

    if (!this.languages.length) return

    this.setLanguage(
      this.hasLanguage(this.preferredLanguage)
        ? this.preferredLanguage
        : this.languages[0]
    )
  },
  watch: {
    selectedLanguage(newVal, oldVal) {
      if (newVal !== oldVal) this.showSelectedLanguage()
    },
    preferredLanguage(newVal, oldVal) {
      if (this.hasLanguage(newVal)) {
        this.setLanguage(newVal)
      }
    }
  }
}
</script>
