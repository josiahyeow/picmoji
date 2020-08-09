import React from 'react'
import { useParams, Redirect } from 'react-router-dom'
import Room from '../Room'

const RoomEntry = (props: any) => {
  const { room } = useParams()

  const playerName = props.location?.state?.playerName
  const playerEmoji = props.location?.state?.playerEmoji

  if (playerName && playerEmoji) {
    return (
      <Room player={{ name: playerName, emoji: playerEmoji }} roomName={room} />
    )
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
