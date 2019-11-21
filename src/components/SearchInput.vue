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
      <span class="syn-input-icon-group-icon">
        <svg width="12px" height="22px" viewBox="0 0 12 12">
          <path d="M4.352,7.344 C4.89600272,7.344 5.39733104,7.20800136 5.856,6.936 C6.31466896,6.66399864 6.677332,6.29866896 6.944,5.84 C7.210668,5.38133104 7.344,4.88000272 7.344,4.336 C7.344,3.79199728 7.210668,3.29066896 6.944,2.832 C6.677332,2.37333104 6.31466896,2.010668 5.856,1.744 C5.39733104,1.477332 4.89600272,1.344 4.352,1.344 C3.80799728,1.344 3.30666896,1.477332 2.848,1.744 C2.38933104,2.010668 2.02400136,2.37333104 1.752,2.832 C1.47999864,3.29066896 1.344,3.79199728 1.344,4.336 C1.344,4.88000272 1.47999864,5.38133104 1.752,5.84 C2.02400136,6.29866896 2.38933104,6.66399864 2.848,6.936 C3.30666896,7.20800136 3.80799728,7.344 4.352,7.344 Z M8.352,7.344 L11.664,10.656 L10.656,11.664 L7.344,8.336 L7.344,7.808 L7.152,7.632 C6.7786648,7.96266832 6.34933576,8.21599912 5.864,8.392 C5.37866424,8.56800088 4.87466928,8.656 4.352,8.656 C3.56266272,8.656 2.83467,8.46400192 2.168,8.08 C1.50133,7.69599808 0.97600192,7.17866992 0.592,6.528 C0.19733136,5.85599664 0,5.12533728 0,4.336 C0,3.54666272 0.19466472,2.81867 0.584,2.152 C0.97333528,1.48533 1.50133,0.96000192 2.168,0.576 C2.83467,0.19199808 3.56266272,7.10542736e-15 4.352,0 C5.14133728,7.10542736e-15 5.87199664,0.19733136 6.544,0.592 C7.19466992,0.97600192 7.70933144,1.49866336 8.088,2.16 C8.46666856,2.82133664 8.656,3.54666272 8.656,4.336 C8.656,4.869336 8.56800088,5.37866424 8.392,5.864 C8.21599912,6.34933576 7.96266832,6.7786648 7.632,7.152 L7.808,7.344 L8.352,7.344 Z" fill="currentColor"></path>
        </svg>
      </span>
    </div>
  </form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
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
