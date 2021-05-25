import React, { useContext, useEffect } from 'react'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import emoji from '../../utils/emoji'
import { MotionBox } from '../Styled/Styled'
import socket from '../../utils/socket'
import Lobby from './Lobby/Lobby'
import Game from './Game/Game'
import TooBigDialog from './TooBigDialog/TooBigDialog'
import { RoomContext, RoomContextProps } from '../providers/RoomProvider'

const Message = styled(MotionBox)`
  background-color: #e0fff8;
  margin: 1rem 0rem;
  padding: 1rem;
  text-align: center;
`

const Error = styled(MotionBox)`
  background-color: #ffe0e4;
  margin: 1rem 0rem;
  padding: 1rem;
  text-align: center;
  font-weight: bold;
`

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: 100%;
  max-width: 80em;
`

const Room = () => {
  const {
    error,
    room,
    players,
    player,
    settings,
    repairing,
    activeGame,
  } = useContext(RoomContext) as RoomContextProps

  useEffect(() => {
    if (error) {
      window.location.reload()
    }
  }, [error])

  return (
    <>
      <TopBar>
        <TooBigDialog />
      </TopBar>
      {error && <Error>{error}</Error>}
      {room.name && players && settings && !repairing ? (
        activeGame ? (
          <>
            {player?.host && (
              <Message
                animate={{ scale: 1, opacity: 1 }}
                initial={{ scale: 0, opacity: 0 }}
              >
                {emoji('👑')} You are the <strong>game host</strong>. You can
                return everyone <strong>back to the lobby</strong> if needed. If
                you leave, a new host will be assigned.
                {emoji('👑')}
              </Message>
            )}
            <Game />
          </>
        ) : (
          <>
            {player?.host && (
              <Message
                animate={{ scale: 1, opacity: 1 }}
                initial={{ scale: 0, opacity: 0 }}
              >
                {emoji('👑')} You are the <strong>game host</strong>. You can{' '}
                <strong>change the game settings</strong> and{' '}
                <strong>start the game</strong>. If you leave, a new host will
                be assigned.{emoji('👑')}
              </Message>
            )}
            <Lobby />
          </>
        )
      ) : (
        <div>Loading room...</div>
      )}
    </>
  )
}

export default Room
