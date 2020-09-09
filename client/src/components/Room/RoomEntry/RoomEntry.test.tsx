import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render } from '@testing-library/react'
import RoomEntry from './RoomEntry'

function renderWithRouter(
  ui: any,
  {
    route = '/room',
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {}
) {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    history,
  }
}

describe('RoomEntry', () => {
  it('should redirect to home page if not provided a player name', () => {
    const { history } = renderWithRouter(<RoomEntry />)
    expect(history.location.pathname).toEqual('/')
  })

  it('should go to the room page if player name is provided', () => {
    const { container } = renderWithRouter(
      <RoomEntry
        location={{ state: { playerName: 'foo', playerEmoji: '😀' } }}
      />
    )
    expect(container.innerHTML).toContain('Loading room...')
  })
})
