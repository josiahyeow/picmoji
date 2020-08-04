import React from 'react'
import { render } from '@testing-library/react'
import PlayerList from './PlayerList'

describe('PlayerList', () => {
  it('should show list of players', () => {
    const players = {
      '1': 'Jack',
      '2': 'Jill',
      '3': 'John',
    }
    const { getByText } = render(<PlayerList players={players} />)
    expect(getByText('Jack'))
    expect(getByText('John'))
    expect(getByText('Jill'))
  })
})
