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
      <H2>{emoji('🧪')} Open Beta</H2>
      <NoticeContainer>
        Mojiparty is currently in open beta. This means that though we've
        completed the core of the game, we're not yet finished and we are still
        adding content and fixing bugs. If you have any game suggestions or come
        across any issues, please reach out to let us know!
      </NoticeContainer>
    </Box>
  )
}

export default Notice
