import React from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Home from './components/Home/Home'
import RoomEntry from './components/Room/RoomEntry'
import { getRandomPlayerEmoji } from './components/Home/EmojiPicker'

const Logo = styled(Link)`
  text-decoration: none !important;
  font-size: 2rem;
  font-weight: bold;
  color: black;
`

const Grid = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-gap: 2rem;
  padding: 1rem;
  font-family: sans-serif;
`

const Header = styled.div`
  grid-row: 1;
`

const Body = styled.div`
  grid-row: 2;
`

function App() {
  return (
    <Grid>
      <Router>
        <Header>
          <Logo to="/">😂 picmoji</Logo>
        </Header>
        <Body>
          <Route exact path="/" component={Home} />
          <Route path="/:room" component={RoomEntry} />
        </Body>
      </Router>
    </Grid>
  )
}

export default App
