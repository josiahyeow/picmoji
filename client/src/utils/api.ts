import config from '../config/config'

export const create = async (roomName: string) =>
  fetch(`${config.SERVER_URL}/room`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ roomName }),
  })

export const roomExists = async (roomName: string) =>
  fetch(`${config.SERVER_URL}/room/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ roomName }),
  })

export const getRoomData = async (roomName: string) =>
  fetch(`${config.SERVER_URL}/room?roomName=${roomName}`)
