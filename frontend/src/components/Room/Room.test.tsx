import React from 'react'
import socketIOClient from 'socket.io-client'
import MockedSocket from 'socket.io-mock'
import { render } from '@testing-library/react'
import Room from './Room'

import { getRoomData } from '../../utils/api'

jest.mock('../../utils/api', () => ({
  getRoomData: jest.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve({
        room: {
          players: {},
        },
      }),
  }),
}))

jest.mock('socket.io-client')

describe('Room', () => {
  let socket

  beforeEach(() => {
    socket = new MockedSocket()
    ;((socketIOClient as unknown) as jest.Mock).mockReturnValue(socket)
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should get room data', () => {
    render(<Room room={'foo'} player={'bar'} />)
    expect(getRoomData).toBeCalledWith('foo')
  })

  it('should connect player to the room', () => {
    render(<Room room={'foo'} player={'bar'} />)
    expect(socketIOClient.connect).toHaveBeenCalled()
  })

  it('should emit a player joined event when player joins the room', () => {
    return undefined
  })

  it('should add player to player list when player joins the room', () => {
    return undefined
  })

  it('should remove player from player list when player leaves the room', () => {
    return undefined
  })
})
