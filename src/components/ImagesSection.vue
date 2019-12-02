<template>
  <div class="images-section">
    <div class="syn-bg-gray syn-flex justify-center align-center">
      <slot></slot>
    </div>
  </div>
</template>

<script>
// This component provides the formatting needed to have mutiple images in one
// gray-background section. ImagePopout.vue handles the caption and popout for an
// individual image
export default {
  name: 'ImagesSection',
}
</script>
