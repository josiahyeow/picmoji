import React from 'react'
import { render } from '@testing-library/react'
import GameControls from './GameControls'

describe('GameControls', () => {
  it('should show start game button when not in game', () => {
    const { getByText } = render(
      <GameControls roomName={'foo'} inGame={false} />
    )
    expect(getByText('Start game'))
  })

  it('should show back to lobby button when in game', () => {
    const { getByText } = render(
      <GameControls roomName={'foo'} inGame={true} />
    )
    expect(getByText('Back to lobby'))
  })
})
