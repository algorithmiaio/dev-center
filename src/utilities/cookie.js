import { isClient } from './env'

export const getCookieValueFrom = (cookie) => (name) => {
  const value = cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)
  if (value) {
    return value.pop() || ''
  }
  return ''
}

export const readCookie = isClient()
  ? getCookieValueFrom(document.cookie)
  : _ => undefined

export const setCookieValue = (name, value, opts) => {
  if (!isClient()) return

  let extra = ''
  if (opts.daysUntilExpire) {
    const date = new Date()
    date.setTime(date.getTime() + opts.daysUntilExpire * 24 * 60 * 60 * 1000)
    extra += `; expires=${date.toUTCString()}`
  }
  if (opts.path) {
    extra += `; path=${opts.path}`
  }
  return (document.cookie = `${name}=${value}${extra}`)
}

export const deleteCookie = (name, path) => {
  if (!isClient()) return

  let extra = ''
  if (path) {
    extra += `; path=${path}`
  }
  return (document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT${extra}`)
}
