import React from 'react'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import config from './config/config'
import emoji from './utils/emoji'
import Home from './components/Home/Home'
import RoomEntry from './components/Room/RoomEntry/RoomEntry'
import GlobalStyle from './components/Styled/GlobalStyle'

const Logo = styled(Link)`
  text-decoration: none !important;
  font-size: 2rem;
  font-weight: 900;
  font-family: 'Poppins', sans-serif;
  font-style: italic;
  color: #000;
`

const Grid = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-gap: 2rem;
  padding: 2rem;
  padding-bottom: 1rem;
  max-width: 80rem;
  margin: auto;
`

const Header = styled.div`
  grid-row: 1;
`

const Body = styled.div`
  grid-row: 2;
`

ReactGA.initialize(config.GA_TRACKING_ID)
ReactGA.pageview(window.location.pathname + window.location.search)

function App() {
  return (
    <>
      <GlobalStyle />
      <Grid>
        <Router>
          <Header>
            <Logo to="/">{emoji('🥳')} mojiparty</Logo>
          </Header>
          <Body>
            <Route exact path="/" component={Home} />
            <Route path="/:room" component={RoomEntry} />
          </Body>
        </Router>
      </Grid>
    </>
  )
}

export default App
