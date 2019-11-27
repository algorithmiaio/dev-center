<template>
  <div class="syn-flex align-center wrap-md">
    <dropdown data-e2e="search-filter">
      <template #default="{open}">
        <div class="syn-btn-group">
          <button
            type="button"
            class="syn-btn text theme-primary no-capitalize syn-width-full-sm"
          >
            {{ activeFilter.name }}
            <caret-down-icon />
          </button>
        </div>
      </template>
      <template #menu>
        <ul class="syn-dropdown-list">
          <li
            v-for="filter in filters"
            :key="filter.value"
            class="syn-dropdown-list-item"
            :class="{ active: activeFilter === filter.value }"
          >
            <a
              role="button"
              class="syn-body-2"
              tabindex="0"
              :data-e2e="'search-filter-' + filter.value"
              @click.prevent="setFilter(filter)"
            >
              {{ filter.name }}
            </a>
          </li>
        </ul>
      </template>
    </dropdown>
  </div>
</template>

<script lang="ts">
import Dropdown from '../../synapse/components/vue/Dropdown'
import CaretDownIcon from '../../synapse/components/vue/icons/CaretDownIcon'
import { filter } from '../store/search'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'FilterSelector',
  components: { Dropdown, CaretDownIcon },
  computed: {
    ...mapGetters({
      activeFilter: 'filter'
    })
  },
  methods: {
    ...mapActions(['setFilter']),
  },
  data() {
    return {
      filters: [
        filter.NONE,
        filter.DEV_CENTER,
        filter.API_DOCS
      ],
    }
  }
}
</script>
