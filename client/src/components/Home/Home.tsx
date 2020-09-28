import React from 'react'
import { Grid, Middle } from '../Styled/Styled'
import EnterRoom from './EnterRoom'
import Instructions from './Instructions'
import Socials from './Socials'
import Contact from './Contact'
import Notice from './Notice'

const Home = (props: any) => {
  const room = props.location?.state?.room
  return (
    <Grid>
      <EnterRoom room={room} />
      <Middle>
        <Notice />
        <Instructions />
        <Grid>
          <Socials />
          <Contact />
        </Grid>
      </Middle>
    </Grid>
  )
}

export default Home
