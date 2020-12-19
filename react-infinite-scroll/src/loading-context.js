
import React, { createContext, useReducer } from 'react'
import { fetchData } from './fake-fetch-data'

const actions = {
  start: 'start',
  loaded: 'loaded'
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
        page: state.page + 1
      }
    default:
      throw new Error(`Unknown action ${action.type} `
        + 'passed to LoadingContext reducer.')
  }
}

export const LoadingContext = createContext()

export const LoadingProvider = ({ children }) => {
  const initialState = {
    data: [],
    loading: false,
    page: 1,
    limit: 10,
    more: true
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  const { data, loading, more, page, limit } = state
  
  const load = () => {
    dispatch({ type: actions.start })
    if (more)
      fetchData({ page, limit })
        .then(newData => dispatch({
          type: actions.loaded,
          newData,
        }))
  }

  return (
    <LoadingContext.Provider value={{  data, load, loading, more  }}>
      { children }
    </LoadingContext.Provider>
    )
}

