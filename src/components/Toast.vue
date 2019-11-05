<template>
  <div class="syn-toast" :class="{ shown: showToast }">
    <div class="syn-flex justify-space-between align-stretch">
      <div class="syn-flex align-center">
        <svg width="14" height="14" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.29 16.29L5.7 12.7c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L10 14.17l6.88-6.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-7.59 7.59c-.38.39-1.02.39-1.41 0z"
          />
        </svg>
        <span class="syn-body-1 syn-text-light-primary syn-mb-0 syn-ml-8">{{message}}</span>
      </div>
      <button
        class="syn-btn icon text medium theme-light"
        data-e2e="toast-close-button"
        @click="closeToast"
      >
        <svg width="20px" height="20px" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
          />
        </svg>
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
  }
}
</script>
