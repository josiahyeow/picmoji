import React from 'react'
import { Grid, Left } from '../Styled/Styled'
import EnterRoom from './EnterRoom'
import Instructions from './Instructions'

const Home = (props: any) => {
  const room = props.location?.state?.room
  return (
    <Grid>
      <EnterRoom room={room} />
      <Instructions />
    </Grid>
  )
}

export default Home
