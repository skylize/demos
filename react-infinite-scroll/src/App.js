
import React from 'react'
import LongList from './long-list'
import { LoadingProvider } from './loading-context'
import './styles.css'

const App = () => (
  <div className='App'>
    <LoadingProvider>
      <LongList />
    </LoadingProvider>
  </div>
)

export default App

