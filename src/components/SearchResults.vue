<template>
  <div>
    <h1>
      Search results for "{{query}}"
    </h1>
    <div class="syn-flex align-center">
      <span class="syn-mr-16">Filter by: </span>
      <filter-selector />
    </div>
  </div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import FilterSelector from './FilterSelector'

export default {
  name: 'SearchResults',
  components: { FilterSelector },
  computed: {
    ...mapGetters(['query'])
  },
  methods: {
    ...mapActions(['setFilter'])
  }
}
</script>
