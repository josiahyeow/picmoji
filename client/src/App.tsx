import React from 'react'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import config from './config/config'
import Home from './components/Home/Home'
import RoomEntry from './components/Room/RoomEntry/RoomEntry'
import GlobalStyle from './components/Styled/GlobalStyle'

const Logo = styled.h1`
  font-size: 1em;
  margin: 0;
`

const LogoLink = styled(Link)`
  text-decoration: none !important;
`

const LogoImg = styled.img`
  width: 12em;
  height: auto;
`

const Grid = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-gap: 1rem;
  padding: 2rem;
  padding-bottom: 1rem;
  max-width: 80rem;
  margin: auto;
`

const Header = styled.div`
  grid-row: 1;
  width: 100%;
  max-width: 80em;
  position: relative;
`

const Body = styled.div`
  grid-row: 2;
`

const EmojiHeader = styled.img`
  display: fixed;
  position: absolute;
  top: 0;
  right: 6%;
  max-width: 16.5em;
  z-index: -1;
  overflow: hidden;
  @media (max-width: 816px) {
    display: none;
  }
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
            <Logo>
              <LogoLink to="/" title="Mojiparty">
                <LogoImg src="mojiparty-title-beta.png" alt="Mojiparty Logo" />
              </LogoLink>
            </Logo>
            <EmojiHeader src="emoji-party.png" />
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
