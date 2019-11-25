<template>
  <div class="image-container">
    <div class="syn-flex direction-column align-center syn-mv-16">
      <div @click="modalOpen = true" ref="image" class="syn-image-shadowed">
        <slot></slot>
      </div>
      <div v-if="caption" class="syn-overline syn-text-center syn-mt-16">
        {{caption}}
      </div>
    </div>
    <modal v-model="modalOpen" no-padding hide-close-btn large align-center card-view-sm>
      <div @click="modalOpen = false">
        <slot></slot>
      </div>
    </modal>
  </div>
</template>

<script>
// This component handles the caption and popout for an individual image.
// ImagesSection handles the gray bg and formatting multiple images in a row.
import Modal from '../../synapse/components/vue/Modal.vue'

export default {
  name: 'ImpagePopout',
  props: {
    caption: {
      type: String,
      required: false
    },
  },
  components: { Modal },
  data() {
    return {
      modalOpen: false,
    }
  }
}
</script>
