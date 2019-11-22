<template>
  <div>
    <div class="syn-bg-gray syn-flex">
      <div @click="modalOpen = true" ref="image" class="syn-ma-16 syn-image-shadowed">
        <slot></slot>
      </div>
    </div>
    <modal v-model="modalOpen" no-padding hide-close-btn>
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
  components: { Modal },
  data() {
    return {
      modalOpen: false,
    }
  }
}
</script>
