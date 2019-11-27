<template>
  <form class="syn-form-group syn-ml-16 syn-mr-16" :action="formAction" method="GET" onclick="event.stopPropagation();">
    <div class="syn-input-icon-group icon-left syn-width-full">
      <input
        ref="input"
        :value="query"
        @input="setQuery($event.target.value)"
        type="text"
        id="search-query"
        class="syn-form-control syn-input-icon-group-input"
        name="q"
        placeholder="Search Docs"
        aria-label="Search"
      >
      <span class="syn-input-icon-group-icon syn-mt-4">
        <search-icon />
      </span>
    </div>
  </form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SearchIcon from '../../synapse/components/vue/icons/SearchIcon'

export default {
  components: { SearchIcon },
  name: 'SearchInput',
  mounted() {
    this.focusInputIfSearchResultsShown()
    this.setInputFromUrl()
    // Lunr isn't consistently ready on page load. It can appear to be
    // initialized but still return no results when results exist.
    // This ensures that results appear if they exist in the search index.
    setTimeout(() => {
      this.setInputFromUrl()
    }, 1000)
  },
  computed: {
    ...mapGetters(['query', 'showSearchResults']),
    formAction() {
      const isLocalDev = location.hostname === 'localhost'
      return `/developers${isLocalDev ? '/' : ''}`
    },
    searchTerm() {
      return new URL(window.location).searchParams.get('q');
    }
  },
  methods: {
    ...mapActions(['setQuery']),
    setInputFromUrl() {
      if (this.searchTerm) {
        this.setQuery(this.searchTerm)
      }
    },
    focusInputIfSearchResultsShown() {
      if (this.showSearchResults) {
        this.$refs.input.focus()
      }
    },
  }
}
</script>
