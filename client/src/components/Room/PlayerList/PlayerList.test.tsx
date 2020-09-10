import React from 'react'
import { render } from '@testing-library/react'
import PlayerList from './PlayerList'

describe('PlayerList', () => {
  it('should show list of players', () => {
    const players = {
      '1': { name: 'Jack', emoji: '🥰' },
      '2': { name: 'John', emoji: '😀' },
    }
    const { getByText } = render(<PlayerList players={players} inGame={false}/>)
    expect(getByText('Jack'))
    expect(getByText('John'))
  })
})
