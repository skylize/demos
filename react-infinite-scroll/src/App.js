import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import './styles.css'
import styles from './styles.js'
import { fetchData } from './fake-fetch-data'
console.clear()

const actions = {
  start: 'start',
  loaded: 'loaded',
}

const reducer = (state, action) => {
  switch (action.type) {
    case actions.start:
      return { ...state, loading: true }
    case actions.loaded:
      return {
        ...state,
        loading: false,
        data: [...state.data, ...action.newData],
        more: action.newData.length === state.limit,
        page: state.page + 1,
      }
    default:
      throw new Error(`Unknown action ${action.type} passed to reducer.`)
  }
}

const FetchDataCtx = createContext()

const FetchDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    data: [],
    loading: false,
    page: 1,
    limit: 10,
    more: true,
  })
  const { data, loading, page, limit, more } = state

  const load = () => {
    dispatch({ type: actions.start })
    more &&
      fetchData({ page, limit: limit }).then(newData =>
        dispatch({
          type: actions.loaded,
          newData,
        }),
      )
  }
  return (
    <FetchDataCtx.Provider value={{ data, loading, load, more }}>
      {children}
    </FetchDataCtx.Provider>
  )
}

const InfiniteScroll = ({
  loadFn,
  moreTest,
  observerOpts = { threshold: 0.2 },
  children,
  ...props
}) => {
  const [target, setTarget] = useState()

  const ref = useCallback(
    node => {
      console.log({ node, target, is: Object.is(node, target) })
      if (!Object.is(node, target))
        setTarget(node) && console.log('setting target')
    },
    [target, setTarget],
  )

  useEffect(() => {
    if (!target || !moreTest || !loadFn) return

    const currentTarget = target

    const onIntersect = entries => {
      console.log({ entries, target, moreTest, loadFn })
      const t = entries.find(
        e => e.isIntersecting && Object.is(e.target, target),
      )
      t && moreTest && moreTest() && loadFn && loadFn()
    }

    const observer = new IntersectionObserver(onIntersect, observerOpts)

    currentTarget && observer.observe(currentTarget)
    return () => currentTarget && observer.unobserve(currentTarget)
  }, [target, moreTest, loadFn, observerOpts])

  return <div ref={ref}>{children}</div>
}

const LoadMore = () => {
  const { loading, more, load } = useContext(FetchDataCtx)
  const [moreTest, setMoreTest] = useState(null)
  useEffect(() => setMoreTest(_ => () => more && !loading), [loading, more])

  return (
    <li>
      <InfiniteScroll loadFn={load} moreTest={moreTest}>
        <div />
      </InfiniteScroll>
    </li>
  )
}

const Loading = () => {
  const { loading, more } = useContext(FetchDataCtx)
  return loading && more && <li style={styles.li}>...Loading</li>
}

const Loader = () => {
  const { data } = useContext(FetchDataCtx)
  return (
    <ul style={styles.ul}>
      {data.map(row => (
        <li key={row} style={styles.dataLi}>
          {row}
        </li>
      ))}
      <LoadMore />
      <Loading />
    </ul>
  )
}

const App = () => (
  <FetchDataProvider>
    <div className='App'>
      <Loader />
    </div>
  </FetchDataProvider>
)

export default App
