import React from 'react'
import { render } from '@testing-library/react'
import RoomDetails from './RoomDetails'
import config from '../../../config/config'

describe('RoomDetails', () => {
  
  it('should show name of room', () => {
    const { getByTestId } = render(<RoomDetails roomName={'foo'} />)
    expect(getByTestId('room-name')).toHaveValue('https://mojiparty.herokuapp.com/foo')
  })
})
