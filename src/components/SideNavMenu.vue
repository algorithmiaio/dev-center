<template>
  <div ref="menu">
    <slot :toggle="toggle" :openSection="openSection"></slot>
  </div>
</template>

<script>
export default {
  name: 'SideNavMenu',
  props: {
    menuIdentifier: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      openSection: ''
    }
  },
  methods: {
    toggle(sectionName) {
      this.openSection = this.openSection === sectionName ? '' : sectionName
    },
    getOpenSection() {
      const openLink = this.$refs.menu.querySelector(`li.cloak-open-nav-item[nav-menu-identifier="${this.menuIdentifier}"]`)
      if (openLink) {
        this.openSection = openLink.id.replace('-list-item', '')
      }
    },
  },
  mounted() {
    this.getOpenSection()
  }
}
</script>
