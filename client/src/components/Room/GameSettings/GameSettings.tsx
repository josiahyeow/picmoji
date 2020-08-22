import React from 'react'
import styled from 'styled-components'
import { Box, H3, Input } from '../../Styled/Styled'
import socket from '../../../utils/socket'
import emoji from '../../../utils/emoji'

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
`

const Label = styled.label``

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
  const handleUpdateCategory = (category) => {
    const newCategories = selectedCategories
    newCategories[category].include = !selectedCategories[category].include
    updateCategories(JSON.parse(JSON.stringify(newCategories)))
  }

  const updateScoreLimit = (newScoreLimit) => {
    socket.emit('update-setting', roomName, 'scoreLimit', newScoreLimit)
  }

  const updateCategories = (updatedCategories) => {
    socket.emit('update-setting', roomName, 'categories', updatedCategories)
  }

  return (
    <Box>
      <Container>
        <H3>Game settings</H3>
        <Label htmlFor="scorelimit-input">Score limit</Label>
        <Input
          id="scorelimit-input"
          value={scoreLimit}
          placeholder="Enter your name"
          type="number"
          onChange={(event) => updateScoreLimit(event.target.value)}
        />
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
