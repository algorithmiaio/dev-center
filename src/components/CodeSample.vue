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
      const sampleText = this.$refs.codeContent.textContent
      console.log(sampleText)
    }
  }
}
</script>
