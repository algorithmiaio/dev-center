<template>
  <div ref="menu">
    <slot :toggle="toggle" :activeSection="activeSection"></slot>
  </div>
</template>

<script>
export default {
  name: 'SideNavMenu',
  data() {
    return {
      activeSection: ''
    }
  },
  methods: {
    toggle(sectionName) {
      console.log('toggling', sectionName)
      this.activeSection = this.activeSection === sectionName ? '' : sectionName
    },
    getOpenSection() {
      const openLink = this.$refs.menu.querySelector('a.cloak-open')
      if (openLink) {
        this.activeSection = openLink.id.replace('-link', '')
      }
    },
  },
  mounted() {
    this.getOpenSection()
  }
}
</script>
