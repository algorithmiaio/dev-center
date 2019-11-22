<template>
  <div class="syn-toast" :class="{ shown: showToast }">
    <div class="syn-flex justify-space-between align-stretch">
      <div class="syn-flex align-center">
        <i class="material-icons">check_circle</i>
        <span class="syn-body-1 syn-text-light-primary syn-mb-0 syn-ml-8">{{message}}</span>
      </div>
      <button
        class="syn-btn icon text medium theme-light"
        data-e2e="toast-close-button"
        @click="closeToast"
      >
        <i class="material-icons icon-size-20">close</i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toast',
  data() {
    return {
      message: '',
      showToast: false,
      timeout: null
    }
  },
  created() {
    this.$root.$on('show-toast', this.openToast)
    this.$root.$on('hide-toast', this.closeToast)
  },
  methods: {
    clearCloseTimeout() {
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
    },
    closeToast() {
      this.clearCloseTimeout()
      this.showToast = false
    },
    openToast(message) {
      this.message = message
      // Show Toast
      this.showToast = true
      // Set Toast Dismiss Delay
      this.timeout = setTimeout(this.closeToast, 4000)
    },
  },
  beforeDestroy() {
    this.clearCloseTimeout()
  }
}
</script>
