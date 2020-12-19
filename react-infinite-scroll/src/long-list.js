
import React, {
  useContext,
  useEffect,
  useState
} from 'react'
import InfiniteScroll from './infinite-scroll'
import { LoadingContext } from './loading-context'

export const LongList = () => {
  const { data, load, loading, more } = useContext(LoadingContext)

  // Example of preventing stale closure by creating moreTest
  // in useEffect. In this case, it could be solved by defining
  // in Provider, but that's not always possible.
  // The InfiniteScroll component will either do nothing or
  // or blow the stack if given functions with stale closures.
  const [moreTest, setMoreTest] = useState()

  useEffect(() => 
    setMoreTest(_ => () => more && !loading),
    [loading, more]
  )

  return (
    <ul>
      {data.map(row => (
        <li key={row}>
          {row}
        </li>
      ))}

      {/* Using the star-of-the-show Component. */}
      {/* Placed loading indicator inside. */}
      <InfiniteScroll loadFn={load} moreTest={moreTest}>
        { more &&
          <li style={{ opacity: 0.4}}>
            { loading && '...loading' }
          </li>
        }
      </InfiniteScroll>
    </ul>
  )
}

export default LongList

