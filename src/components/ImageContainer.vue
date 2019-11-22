<template>
  <div>
    <div class="syn-bg-gray syn-flex direction-column align-center">
      <div @click="modalOpen = true" ref="image" class="syn-ma-16 syn-image-shadowed">
        <slot></slot>
      </div>
      <div v-if="caption" class="syn-overline syn-text-center syn-mh-16 syn-mb-16">
        {{caption}}
      </div>
    </div>
    <modal v-model="modalOpen" no-padding hide-close-btn large>
      <div @click="modalOpen = false">
        <slot></slot>
      </div>
    </modal>
  </div>
</template>

<script>
import Modal from '../../synapse/components/vue/Modal.vue'

export default {
  name: 'ImageContainer',
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
