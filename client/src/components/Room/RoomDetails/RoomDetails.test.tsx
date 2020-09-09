import React from 'react'
import { render } from '@testing-library/react'
import RoomDetails from './RoomDetails'

describe('RoomDetails', () => {
  it('should show name of room', () => {
    const { getByText } = render(<RoomDetails roomName={'foo'} />)
    expect(getByText('foo'))
  })
})
