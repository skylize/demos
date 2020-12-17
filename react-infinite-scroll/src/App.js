import React, { useState, useReducer } from 'react'
import './styles.css'
import styles from './styles.js'
import { fetchData } from './fake-fetch-data'

const actions = {
  start: 'start',
  loaded: 'loaded',
}

const reducer = (state, action) => {
  ;(() => {
    const { data, limit, page } = state
    console.log({ len: data.length + 10, past: limit * page, limit, page })
  })()
  const reductions = {
    [actions.start]: _ => ({ ...state, loading: true }),

    [actions.loaded]: ({ data, limit, page }, { newData }) => ({
      ...state,
      loading: false,
      data: [...data, ...newData],
      more: newData.length === limit,
      page: page + 1,
    }),
  }
  if (!Object.keys(reductions).includes(action.type))
    throw new Error(`Unknown action ${action.type} passed to reducer.`)

  return reductions[action.type](state, action)
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    data: [],
    loading: false,
    page: 1,
    limit: 10,
    more: true,
  })
  const { data, loading, page, limit, more } = state
  console.log(state)

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
    <div className='App'>
      <ul style={styles.ul}>
        {data.map(row => (
          <li key={row} style={styles.dataLi}>
            {row}
          </li>
        ))}
        {loading ||
          (more && (
            <li style={styles.btnMoreLi}>
              <button style={styles.btn} onClick={load}>
                Load more
              </button>
            </li>
          ))}
        {loading && more && <li style={styles.loadingLi}>...Loading</li>}
      </ul>
    </div>
  )
}

export default App
