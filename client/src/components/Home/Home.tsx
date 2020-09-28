import React from 'react'
import styled from 'styled-components'
import { Grid, Middle } from '../Styled/Styled'
import EnterRoom from './EnterRoom'
import Instructions from './Instructions'
import Socials from './Socials'
import Contact from './Contact'
import Notice from './Notice'

const LinksGrid = styled(Grid)`
  @media (max-width: 1235px) {
    grid-template-columns: auto;
  }
`

const Home = (props: any) => {
  const room = props.location?.state?.room
  return (
    <Grid>
      <EnterRoom room={room} />
      <Middle>
        <Notice />
        <Instructions />
        <LinksGrid>
          <Socials />
          <Contact />
        </LinksGrid>
      </Middle>
    </Grid>
  )
}

export default Home
