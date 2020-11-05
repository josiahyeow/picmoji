import React from 'react'
import { render } from '@testing-library/react'
import RoomDetails from './RoomDetails'

describe('RoomDetails', () => {
  beforeAll((): void => {
    // @ts-ignore
    delete window.location
    // @ts-ignore
    window.location = {
      href: 'https://www.mojiparty.io/foo',
    }
  })

  it('should show name of room', () => {
    const { getByTestId } = render(
      <RoomDetails roomName={'foo'} roomPassword={''} />
    )
    expect(getByTestId('room-name')).toHaveValue('https://www.mojiparty.io/foo')
  })
})
