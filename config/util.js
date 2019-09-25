const caseInsensitiveEquals = (string1, string2) => {
  const string1Lower = (string1 || '').toLowerCase()
  const string2Lower = (string2 || '').toLowerCase()
  return string1Lower === string2Lower
}

module.exports = { caseInsensitiveEquals }
