export function debounce(func, ms = 350) {
  let timeout

  return function debounced(...args) {
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      timeout = null
      func.apply(this, args)
    }, ms)
  }
}
