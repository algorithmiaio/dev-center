<template>
  <div class="syn-code-block">
    <div class="syn-code-block-header syn-flex justify-space-between align-center">
      <span class="syn-overline syn-text-light-primary syn-mb-0 syn-ml-16 syn-mr-8">{{title}}</span>
      <div class="syn-ma-8 syn-flex align-center">
        <select class="syn-code-language-selector syn-mr-8" v-if="languages.length > 1" v-model="selectedLanguage">
          <option v-for="language in languages" :key="language" :value="language">
            {{ language }}
          </option>
        </select>
        <button class="syn-btn no-padding" @click="copySample" title="Copy">
          <svg width="14" height="14" viewBox="0 0 24 24" class="syn-ma-4">
            <path
              fill="currentColor"
              d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z"
            />
          </svg>
        </button>
      </div>
    </div>
    <div class="syn-code-block-body" ref="codeContent" replace-user-creds>
      <slot>
        <pre><code>// Sample Code Block
  console.log('Hello world!')</code></pre>
      </slot>
    </div>
  </div>
</template>

<script>
import { copyToClipboard } from '../utilities/clipboard'

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
    }
  },
  mounted() {
    // Wait to check for languages till mounted
    this.languages = this.processLanguages()
    if (this.languages.length) this.selectedLanguage = this.languages[0]
  },
  watch: {
    selectedLanguage(newVal, oldVal) {
      if (newVal !== oldVal) this.showSelectedLanguage()
    }
  }
}
</script>
