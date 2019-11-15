<template>
  <div ref="menu">
    <slot :toggle="toggle" :openSection="openSection"></slot>
  </div>
</template>

<script>
export default {
  name: 'SideNavMenu',
  data() {
    return {
      openSection: ''
    }
  },
  methods: {
    toggle(sectionName) {
      console.log('toggling', sectionName)
      this.openSection = this.openSection === sectionName ? '' : sectionName
    },
    getOpenSection() {
      const openLink = this.$refs.menu.querySelector('a.cloak-open')
      if (openLink) {
        this.openSection = openLink.id.replace('-link', '')
      }
    },
  },
  mounted() {
    this.getOpenSection()
  }
}
</script>
