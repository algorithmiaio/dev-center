<template>
  <h1>
    Search results for "{{query}}"
  </h1>
</template>

<script>
import { Lunr } from '../utils/lunr'

export default {
  name: 'SearchResults',
  data() {
    return {
      query: ''
    }
  },
  mounted() {
    this.query = this.getSearchQuery()
    this.lunr = Lunr.create('/developers/js/search.json')

    window.looner = this.lunr
  },
  methods: {
    getSearchQuery() {
      return new URL(window.location).searchParams.get('q');
    }
  }
}
</script>
