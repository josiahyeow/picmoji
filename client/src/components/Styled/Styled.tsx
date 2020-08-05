import styled from 'styled-components'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 0.3fr 1fr auto;
  grid-gap: 1rem;
`

export const Left = styled.div`
  grid-column: 1;
  display: grid;
  grid-gap: 1rem;
`

export const Middle = styled.div`
  grid-column: 2;
`

export const Right = styled.div`
  grid-column: 3;
`

export const Box = styled.div`
  background: #f2f2f2;
  padding: 1rem;
  border-radius: 6px;
`

export const H2 = styled.h2``

export const H3 = styled.h3`
  margin-top: 0;
`
export const H4 = styled.h4`
  margin-top: 0;
`
