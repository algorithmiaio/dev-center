export const isClient = () => {
  try {
    return window !== undefined && document !== undefined
  } catch {
    return false
  }
}
