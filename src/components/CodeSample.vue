<template>
  <div class="syn-code-block">
    <div class="syn-code-block-btn">
      <select v-if="languages.length > 1" v-model="selectedLanguage">
        <option v-for="language in languages" :key="language" :value="language">
          {{ language }}
        </option>
      </select>
      <button class="syn-btn" @click="copySample">Copy</button>
    </div>
    <div ref="codeContent">
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
  data() {
    return {
      languages: [],
      selectedLanguage: ''
    }
  },
  methods: {
    copySample() {
      const copyText = this.$refs.codeContent.textContent
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
        const sampleCode = sample.querySelector('code')
        const sampleLang = sampleCode.getAttribute('data-lang')
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
