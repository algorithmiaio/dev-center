<template>
  <div class="syn-code-block">
    <div class="syn-code-block-header syn-flex justify-space-between">
      <span class="syn-overline syn-mb-0">{{title}}</span>
      <div class="syn-ma-8">
        <select class="syn-code-language-selector syn-mr-8" v-if="languages.length > 1" v-model="selectedLanguage">
          <option v-for="language in languages" :key="language" :value="language">
            {{ language }}
          </option>
        </select>
        <button class="syn-btn" @click="copySample">Copy</button>
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
      const el = document.createElement('textarea')
      el.value = copyText
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
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
