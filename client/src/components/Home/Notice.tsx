import React from 'react'
import styled from 'styled-components'
import emoji from '../../utils/emoji'
import { Box, H2 } from '../Styled/Styled'

const NoticeContainer = styled.div`
  display: flex;
  padding: 1em;
  background-color: #fffcdd;
  border-radius: 6px;
`

const Notice = () => {
  return (
    <Box>
      <H2>{emoji('🛠')} Work in Progress</H2>
      <NoticeContainer>
        Mojiparty is still a work in progress. If you have any game suggestions
        or come across any issues, please reach out to let us know!
      </NoticeContainer>
    </Box>
  )
}

export default Notice
