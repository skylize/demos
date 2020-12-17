// Return a delayed promise for the return val of a fn
export const withDelay = (delay, f) => (...xs) =>
  new Promise(resolve => setTimeout(() => resolve(f(...xs)), 800))

// Mimick an api fetch wrapper
export const createFakeFetchWrapper = ({ count, delay = 15 }) => {
  const data = Array.from(Array(count), (_, i) => i)
  const pageData = ({ page, limit }) => {
    console.log({ page, limit })
    const end = page * limit
    return data.slice(end - limit, end)
  }
  return withDelay(delay, pageData)
}

export const fetchData = createFakeFetchWrapper({ count: 2000, delay: +400 })

export default createFakeFetchWrapper
