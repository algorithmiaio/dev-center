<template>
  <div>
    <h1>
      Search results for "{{query}}"
    </h1>
    <div class="syn-flex align-center syn-mb-8">
      <span class="syn-mr-16">Filter by: </span>
      <filter-selector />
    </div>

    <div class="syn-break"></div>

    <ul v-if="results.length" class="syn-list">
      <li v-for="result in results" :key="result.id">
        <div class="syn-media-object">
          <div class="syn-media-object-body">
            <div class="syn-flex align-center">
              <h3 class="header-inline">
                <a :href="result.url">{{result.title}}</a>
              </h3>
              <span class="syn-badge syn-ml-8">{{result.is_api_result ? 'API Docs' : 'Documentation'}}</span>
            </div>
            <p class="syn-body-2 syn-text-secondary">{{result.excerpt}}</p>
          </div>
        </div>
      </li>
    </ul>

    <p v-if="!results.length">No results</p>
  </div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import FilterSelector from './FilterSelector'

export default {
  name: 'SearchResults',
  components: { FilterSelector },
  computed: {
    ...mapGetters(['query', 'results'])
  },
  methods: {
    ...mapActions(['setFilter'])
  }
}
</script>
