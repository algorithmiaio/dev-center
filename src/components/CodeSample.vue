<template>
  <div class="syn-code-block">
    <div class="syn-code-block-btn">
      <button class="syn-btn">Copy</button>
    </div>
    <slot ref="code-content">
      <pre><code>// Sample Code Block
console.log('Hello world!')</code></pre>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'CodeSample'
}
</script>
