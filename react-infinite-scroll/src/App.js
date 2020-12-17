import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import './styles.css'
import styles from './styles.js'
import { fetchData } from './fake-fetch-data'

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
      fetchData({ page, limit }).then(newData =>
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

const LoadMore = () => {
  const { loading, more, load } = useContext(FetchDataCtx)
  const [element, setElement] = useState()
  const loader = useRef(load)

  const observer = useRef(
    new IntersectionObserver(
      entries => entries[0].isIntersecting && loader.current(),
      { threshold: 0.2 },
    ),
  )

  useEffect(() => {
    loader.current = load
  }, [load])

  useEffect(() => {
    const el = element
    const ob = observer.current

    el && ob.observe(el)

    return () => el && ob.unobserve(el)
  }, [element])

  return !loading && more && <li ref={setElement} style={styles.btnMoreLi} />
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

export default App = () => (
  <FetchDataProvider>
    <div className='App'>
      <Loader />
    </div>
  </FetchDataProvider>
)
