import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Grid, Left } from '../Styled/Styled'
import EnterRoom from './EnterRoom/EnterRoom'

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
