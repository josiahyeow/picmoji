import React, { useState, useEffect } from 'react'
import socketIOClient from 'socket.io-client'

const ENDPOINT = 'http://localhost:5000'

function App() {
  const [response, setResponse] = useState('')

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT)
    socket.on('fromAPI', (data: any) => {
      setResponse(data)
    })
  }, [])
  return <div>{response}</div>
}

export default App
