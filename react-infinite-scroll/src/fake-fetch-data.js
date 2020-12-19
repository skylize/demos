
// Return a delayed promise for the return val of a fn
export const withDelay = (delay, f) => (...xs) =>
  new Promise(resolve => 
    setTimeout( () => resolve(f(...xs)), 800) )

// Mimick an api fetch wrapper
export const createFakeFetchWrapper = (
    { count = 100, delay = 500 } = {}
) => {
  const data = Array.from(Array(count), (_, i) => i)

  const paginate = ({ page, limit }) => {
    const end = page * limit
    return data.slice(end - limit, end)
  }

  return withDelay(delay, paginate)
}

export const fetchData = createFakeFetchWrapper()

export default fetchData

