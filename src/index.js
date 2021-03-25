import React from 'react'
import ReactDOM from 'react-dom'
import {App2} from './App2'
import { initContract } from './utils'

window.nearInitPromise = initContract()
  .then(() => {
    ReactDOM.render(
      <App2 />,
      document.querySelector('#root')
    )
  })
  .catch(console.error)
