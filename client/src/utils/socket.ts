import socketIOClient from 'socket.io-client'
import { SERVER_URL } from '../config/config'

const socket = socketIOClient(SERVER_URL)

export default socket
