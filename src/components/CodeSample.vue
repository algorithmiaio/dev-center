<template>
  <div class="syn-code-block">
    <div class="syn-code-block-btn">
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
    }
  }
}
</script>
