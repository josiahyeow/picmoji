import React from 'react'
import { Grid, Left } from '../Styled/Styled'
import EnterRoom from './EnterRoom'

const Home = (props: any) => {
  const room = props.location?.state?.room
  return (
    <Grid>
      <Left>
        <EnterRoom room={room} />
      </Left>
    </Grid>
  )
}

export default Home
