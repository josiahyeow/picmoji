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
  background-color: #fff;
`

const Category = styled.div`
  margin-bottom: 0.5rem;
`

const CategoryCheckbox = styled.input`
  margin-right: 0.5rem;
`

const CategoryLabel = styled.label`
  text-transform: capitalize;
`

const CategoryIcon = styled.span`
  margin-right: 0.5rem;
`

const CategoryName = styled.span`
  font-weight: bold;
`

const GameSettings = ({ roomName, settings }) => {
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
        <H3>Game settings</H3>
        <Label htmlFor="scorelimit-input">Score limit</Label>
        <Select
          id="scorelimit-input"
          value={scoreLimit}
          onChange={(e) => updateScoreLimit(e.target.value)}
        >
          {SCORE_LIMITS.map((scoreLimit) => (
            <option value={scoreLimit}>{scoreLimit}</option>
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
              />
              <CategoryLabel htmlFor={`${category}-checkbox`}>
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
