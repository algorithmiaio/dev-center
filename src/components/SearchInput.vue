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
    this.updateQueryFromUrl()
    this.focusInputIfSearchResultsShown()
  },
  computed: {
    ...mapGetters(['query', 'areSearchResultsShown']),
    formAction() {
      const isLocalDev = location.hostname === 'localhost'
      return `/developers${isLocalDev ? '/' : ''}`
    }
  },
  methods: {
    ...mapActions(['setQuery']),
    updateQueryFromUrl() {
      const query = new URL(window.location).searchParams.get('q');

      if (query) {
        this.setQuery(query)
      }
    },
    focusInputIfSearchResultsShown() {
      if (this.areSearchResultsShown) {
        this.$refs.input.focus()
      }
    },
  }
}
</script>
