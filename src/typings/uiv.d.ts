declare module 'uiv' {
  import { DirectiveOptions, PluginFunction, VueConstructor } from 'vue'

  export const Affix: VueConstructor
  export const Alert: VueConstructor
  export const Breadcrumbs: VueConstructor
  export const Button: VueConstructor
  export const ButtonGroup: VueConstructor
  export const Carousel: VueConstructor
  export const Collapse: VueConstructor
  export const DatePicker: VueConstructor
  export const Dropdown: VueConstructor
  export const Modal: VueConstructor
  export const Pagination: VueConstructor
  export const Popover: VueConstructor
  export const ProgressBar: VueConstructor
  export const Tabs: VueConstructor
  export const TimePicker: VueConstructor
  export const Tooltip: VueConstructor
  export const Typeahead: VueConstructor

  export const scrollspy: DirectiveOptions
  export const popover: DirectiveOptions
  export const tooltip: DirectiveOptions

  export const install: PluginFunction<never>
}
