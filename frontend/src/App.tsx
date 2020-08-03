import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Home from './components/Home/Home'
import Room from './components/Room/Room'

function App() {
  return (
    <>
      <Router>
        <Link to="/">Emojicon</Link>
        <Route exact path="/" component={Home} />
        <Route path="/:room" component={Room} />
      </Router>
    </>
  )
}

export default App
