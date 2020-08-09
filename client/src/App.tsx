import React from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Home from './components/Home/Home'
import RoomEntry from './components/Room/RoomEntry/RoomEntry'

const Logo = styled(Link)`
  text-decoration: none !important;
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(120deg, #fccb90 0%, #d57eeb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Grid = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-gap: 2rem;
  padding: 2rem;
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
          <Logo to="/">picmoji</Logo>
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
