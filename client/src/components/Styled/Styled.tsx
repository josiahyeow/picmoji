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
  background: #ffffff;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 6px 15px rgba(36, 37, 38, 0.08);
`

export const H2 = styled.h2``

export const H3 = styled.h3`
  margin-top: 0;
`
export const H4 = styled.h4`
  margin-top: 0;
`
export const Button = styled.button`
  padding: 1rem;
  border-radius: 6px;
  border: none;
  background-image: linear-gradient(
    45deg,
    #ff9a9e 0%,
    #fad0c4 99%,
    #fad0c4 100%
  );
  font-weight: bold;
  color: white;
`
export const Input = styled.input`
  padding: 1rem;
  border-radius: 6px;
  background-color: #f2f2f2;
  border: #ffffff 1px solid;
  &:hover {
    border: #d5d5d5 1px solid;
  }
  &:focus {
    background-color: #ffffff;
  }
  transition: background-color 0.5s ease, border-color 0.5s ease;
`
