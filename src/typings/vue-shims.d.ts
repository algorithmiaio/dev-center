// This shim declares a typed Vue in every .vue file which
// allows you to get away with just exporting a plain object.
// However, if your controller uses 'this' to reference the
// functionality from the `Vue` class, you'll need to be explicit:
// `export default Vue.extends({...})`
declare module '*.vue' {
  import Vue from 'vue'

  export default Vue
}
