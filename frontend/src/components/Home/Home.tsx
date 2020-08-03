import React, { useState, useEffect } from 'react'
import EnterRoom from './EnterRoom/EnterRoom'

const Home = (props: any) => {
  const room = props.location?.state?.room
  return <EnterRoom room={room} />
}

export default Home
