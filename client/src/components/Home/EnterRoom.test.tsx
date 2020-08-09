import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { fireEvent, waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import EnterRoom from './EnterRoom'
import { createRoom, roomExists } from '../../utils/api'

jest.mock('../../utils/api', () => ({
  createRoom: jest.fn().mockResolvedValue({ ok: true }),
  roomExists: jest.fn().mockResolvedValue({ ok: true }),
}))

describe('EnterRoom', () => {
  describe('UI elements', () => {
    it('should show player name input field', () => {
      const { getByLabelText } = render(<EnterRoom />)
      expect(getByLabelText('Player name'))
    })

    it('should show room name input field', () => {
      const { getByLabelText } = render(<EnterRoom />)
      expect(getByLabelText('Room name'))
    })

    it('should show create room button', () => {
      const { getByText } = render(<EnterRoom />)
      expect(getByText('Create Room'))
    })

    it('should show join room button', () => {
      const { getByText } = render(<EnterRoom />)
      expect(getByText('Join Room'))
    })
  })

  it('should prefill room input and hide create room button if room is provided', () => {
    const { getByText, getByLabelText, queryByText } = render(
      <EnterRoom room={'foo'} />
    )
    expect(getByLabelText('Room name')).toHaveValue('foo')
    expect(queryByText('Create Room')).toBeNull()
    expect(getByText('Join Room'))
  })

  it('should create new room and join it', () => {
    const { getByText, getByLabelText } = render(<EnterRoom />, {
      wrapper: MemoryRouter,
    })
    userEvent.type(getByLabelText('Player name'), 'foo')
    userEvent.type(getByLabelText('Room name'), 'bar')
    fireEvent.click(getByText('Create Room'))
    expect(createRoom).toBeCalled()
    expect(roomExists).not.toBeCalled()
  })

  it('should join room', () => {
    const { getByText, getByLabelText } = render(<EnterRoom />, {
      wrapper: MemoryRouter,
    })
    userEvent.type(getByLabelText('Player name'), 'foo')
    userEvent.type(getByLabelText('Room name'), 'bar')
    fireEvent.click(getByText('Join Room'))
    expect(roomExists).toBeCalled()
  })

  describe('Error handling', () => {
    it('should show error message when player and/or room name is not filled in', () => {
      const { getByText } = render(<EnterRoom />)
      fireEvent.click(getByText('Create Room'))
      expect(getByText('Please enter both your player and room name'))
    })

    it('should show error message when creating a room that already exists', async () => {
      ;(createRoom as jest.Mock).mockResolvedValue({ ok: false })
      const { getByText, getByLabelText } = render(<EnterRoom />, {
        wrapper: MemoryRouter,
      })
      userEvent.type(getByLabelText('Player name'), 'foo')
      userEvent.type(getByLabelText('Room name'), 'bar')
      fireEvent.click(getByText('Create Room'))
      await waitFor(() =>
        expect(
          getByText('Room bar already exists. Please choose another name.')
        )
      )
    })

    it('should show error message when room to join doesnt exists', async () => {
      ;(roomExists as jest.Mock).mockResolvedValue({ ok: false })
      const { getByText, getByLabelText } = render(<EnterRoom />, {
        wrapper: MemoryRouter,
      })
      userEvent.type(getByLabelText('Player name'), 'foo')
      userEvent.type(getByLabelText('Room name'), 'bar')
      fireEvent.click(getByText('Join Room'))
      await waitFor(() => expect(getByText('Could not find room bar')))
    })
  })
})
