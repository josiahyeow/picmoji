import React from 'react'
import { render } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('should show game logo', () => {
    const { getByText } = render(<App />)
    expect(getByText('mojiparty'))
  })
})
