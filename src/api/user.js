export async function getCurrentUser() {
  const response = await fetch('/webapi/user', {
    headers: {
      accept: 'application/json, text/plain, */*',
    }
  })

  const { user } = await response.json()
  return user
}
