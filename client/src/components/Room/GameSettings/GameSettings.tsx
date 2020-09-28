import React from 'react'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import { Box, H3, Label, Select } from '../../Styled/Styled'
import socket from '../../../utils/socket'
import emoji from '../../../utils/emoji'

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
`

const CategorySelector = styled(Box)`
  border: none;
  background-color: #f1f4f7;
`

const Category = styled.div`
  margin-bottom: 0.5rem;
  &:last-child {
    margin-bottom: 0em;
  }
`

const CategoryCheckbox = styled.input`
  margin-right: 0.5rem;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
  }
`

const CategoryLabel = styled.label<{ disabled: boolean }>`
  text-transform: capitalize;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

const CategoryIcon = styled.span`
  margin-right: 0.5rem;
`

const CategoryName = styled.span`
  font-weight: bold;
`

const ONLY_HOST_MESSAGE = 'Only the host can change the game settings'

const GameSettings = ({ roomName, settings, disabled }) => {
  const { scoreLimit, selectedCategories } = settings

  const SCORE_LIMITS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]

  const handleUpdateCategory = (category) => {
    const newCategories = selectedCategories
    newCategories[category].include = !selectedCategories[category].include
    updateCategories(JSON.parse(JSON.stringify(newCategories)))
  }

  const updateScoreLimit = (newScoreLimit) => {
    ReactGA.event({
      category: 'Lobby',
      action: 'Updated setting',
      label: 'Score limit',
    })
    socket.emit('update-setting', roomName, 'scoreLimit', newScoreLimit)
  }

  const updateCategories = (updatedCategories) => {
    ReactGA.event({
      category: 'Lobby',
      action: 'Updated setting',
      label: 'Categories',
    })
    socket.emit('update-setting', roomName, 'categories', updatedCategories)
  }

  return (
    <Box>
      <Container>
        <H3>Game Settings</H3>
        <Label htmlFor="scorelimit-input">Score Limit</Label>
        <Select
          id="scorelimit-input"
          value={scoreLimit}
          onChange={(e) => updateScoreLimit(e.target.value)}
          disabled={disabled}
          title={disabled ? ONLY_HOST_MESSAGE : ''}
        >
          {SCORE_LIMITS.map((scoreLimit) => (
            <option key={scoreLimit} value={scoreLimit}>
              {scoreLimit}
            </option>
          ))}
        </Select>
        <Label>Categories</Label>
        <CategorySelector>
          {Object.keys(selectedCategories).map((category) => (
            <Category key={category}>
              <CategoryCheckbox
                type="checkbox"
                name={`${category}-checkbox`}
                value={`${category}`}
                checked={selectedCategories[category].include}
                onChange={(event) => handleUpdateCategory(event.target.value)}
                disabled={disabled}
                title={disabled ? ONLY_HOST_MESSAGE : ''}
              />
              <CategoryLabel
                htmlFor={`${category}-checkbox`}
                onClick={() => !disabled && handleUpdateCategory(category)}
                disabled={disabled}
                title={disabled ? ONLY_HOST_MESSAGE : ''}
              >
                <CategoryIcon>
                  {emoji(selectedCategories[category].icon)}
                </CategoryIcon>
                <CategoryName>{selectedCategories[category].name}</CategoryName>
              </CategoryLabel>
            </Category>
          ))}
        </CategorySelector>
      </Container>
    </Box>
  )
}

export default GameSettings
