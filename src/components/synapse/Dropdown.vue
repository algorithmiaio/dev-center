<template>
  <div
    ref="dropdown"
    class="syn-dropdown"
    :class="{
      open: open,
      right: direction === 'right',
      top: direction === 'top',
    }"
    :data-e2e="dataE2e"
  >
    <div ref="dropdownToggle" @click.stop="toggleMenu">
      <slot :open="open"></slot>
    </div>
    <div
      v-if="!capturePageClick"
      class="syn-dropdown-bg"
      @click="handleClick"
    ></div>
    <div ref="dropdownMenu" @click="handleClick">
      <slot name="menu" :open="open"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { repositionDropdownMenu } from '../../utils/synapse'

export default {
  props: {
    dataE2e: {
      type: String,
    },
    direction: {
      type: String,
      default: 'right',
    },
    capturePageClick: {
      // For cases where having the background-overlay doesn't work
      // For example, when dropdown is inside an element with its own z-index/positioning
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      open: false,
    }
  },
  methods: {
    handleClick() {
      if (this.open) {
        this.toggleMenu()
      }
    },
    handleClosed() {
      try {
        this.$emit('closed')
        document.removeEventListener('keydown', this.handleKeydown)
        if (this.capturePageClick)
          document.removeEventListener('click', this.handlePageClick, true)
      } finally {
        return
      }
    },
    handleKeydown(e) {
      if (e.keyCode === 27 && this.open) {
        // Close menu when Escape pressed
        this.toggleMenu()
      }
    },
    handleOpen() {
      try {
        this.reposition()
        document.addEventListener('keydown', this.handleKeydown)
        if (this.capturePageClick)
          document.addEventListener('click', this.handlePageClick, true)
      } finally {
        return
      }
    },
    handlePageClick(e) {
      if (!this.isInDropdownToggle(e.target)) this.handleClick()
    },
    isInDropdownToggle(el) {
      let element = el
      while (element.tagName !== 'BODY') {
        if (element === this.$refs.dropdownToggle) return true
        element = element.parentElement
      }
      return false
    },
    reposition() {
      repositionDropdownMenu(this.$refs.dropdownMenu.children[0])
    },
    toggleMenu() {
      this.open = !this.open

      this.$nextTick(() => {
        if (this.open) {
          this.handleOpen()
        } else {
          this.handleClosed()
        }
      })
    },
  },
}
</script>
