<template>
  <div class="syn-article">
    <h1>
      Search results for "{{query}}"
    </h1>
    <div class="syn-flex align-center syn-mb-8">
      <span class="syn-mr-16">Filter by: </span>
      <filter-selector />
    </div>

    <div class="syn-aside">

      <div class="syn-aside-main">
        <div class="syn-break syn-mb-0"></div>

        <ul v-if="results.length" class="syn-list">
          <li v-for="result in results" :key="result.id">
            <div class="syn-media-object">
              <div class="syn-media-object-body">
                <div class="syn-flex align-center syn-mb-8">
                  <code-icon v-if="result.is_api_result" class="syn-text-secondary syn-mr-4" />
                  <doc-icon v-else class="syn-text-secondary syn-mr-4" />
                  <span class="syn-overline syn-text-secondary">{{result.is_api_result ? 'API DOCS' : 'DOCUMENTATION'}}</span>
                </div>
                <h3 class="header-inline">
                  <a :href="result.url">{{result.title}}</a>
                </h3>
                <p class="syn-body-2 syn-text-secondary">{{result.excerpt}}</p>
              </div>
            </div>
          </li>
        </ul>
        <p v-if="!results.length">No results</p>
      </div>

      <div class="syn-aside-side">

        <div class="syn-card">
          <div class="syn-media-object">
            <div class="syn-user-image syn-user-image-56 syn-media-object-image">
              <help-icon />
            </div>
            <div class="syn-media-object-body">
              <h4>Need Help?</h4>
              <p class="syn-card-text syn-body-2">We're here to help with any questions or code.</p>
              <div class="syn-card-actions">
                <a
                  class="syn-font-weight-bold syn-flex align-center"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://support.algorithmia.com/hc/en-us/requests/new?ticket_form_id=360000194732">
                  <span class="syn-mr-4">Submit a Request</span>
                  <right-arrow-icon />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import FilterSelector from './FilterSelector'
import CodeIcon from '../../synapse/components/vue/icons/CodeIcon'
import DocIcon from '../../synapse/components/vue/icons/DocIcon'
import HelpIcon from './icons/HelpIcon'
import RightArrowIcon from '../../synapse/components/vue/icons/RightArrowIcon'

export default {
  name: 'SearchResults',
  components: { FilterSelector, CodeIcon, DocIcon, HelpIcon, RightArrowIcon },
  computed: {
    ...mapGetters(['query', 'results'])
  },
  methods: {
    ...mapActions(['setFilter'])
  }
}
</script>
