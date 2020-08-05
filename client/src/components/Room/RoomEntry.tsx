import React from 'react'
import { useParams, Redirect } from 'react-router-dom'
import Room from './Room'

const RoomEntry = (props: any) => {
  const { room } = useParams()

  const player = props.location?.state?.player

  if (player) {
    return <Room player={player} room={room} />
  } else {
    return (
      <Redirect
        to={{
          pathname: '/',
          state: { room },
        }}
      />
    )
  }
}

export default RoomEntry
