const SocketMock = require("socket.io-mock");
const playerEvents = require("./player");
const Players = require("../actions/players");
const { sendRoomUpdate, resetRoom } = require("../utils/update-room");

jest.mock("../actions/players", () => ({
  add: jest.fn(),
  remove: jest.fn(),
  removeFromAllRooms: jest.fn(),
}));

jest.mock("../utils/update-room", () => ({
  sendRoomUpdate: jest.fn(),
  resetRoom: jest.fn(),
}));

describe("player events", function () {
  const io = new SocketMock();
  const emit = jest.fn();
  io.to = jest.fn().mockImplementation(() => ({ emit }));

  let socket = new SocketMock();
  socket.id = "testId";
  socket.join = jest.fn();
  socket.leave = jest.fn();
  socket.emit = jest.fn();

  playerEvents(io, socket);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should add player to room and emit update events", () => {
    const testPlayer = {
      name: "testPlayer",
      emoji: "😀",
    };
    socket.socketClient.emit("player-joined", "testRoom", testPlayer);
    expect(Players.add).toBeCalledWith("testRoom", "testId", testPlayer);
    expect(socket.join).toBeCalledWith("testRoom");
    expect(socket.emit).toBeCalledWith("joined-room", "testId");
    expect(io.to).toBeCalledWith("testRoom");
    expect(emit).toBeCalledWith("new-chat-message", {
      text: `${testPlayer.name} joined, say hello`,
      player: { emoji: "👋", name: "BOT" },
      correct: false,
      system: true,
    });
    expect(sendRoomUpdate).toBeCalledWith(io, "testRoom");
  });

  it("should remove player and emit update events", () => {
    const testPlayer = {
      name: "testPlayer",
      emoji: "😀",
    };
    socket.socketClient.emit("player-left", "testRoom", testPlayer);
    expect(Players.remove).toBeCalledWith("testRoom", "testId");
    expect(socket.leave).toBeCalledWith("testRoom");
    expect(io.to).toBeCalledWith("testRoom");
    expect(emit).toBeCalledWith("new-chat-message", {
      text: `${testPlayer.name} left, adios`,
      player: { emoji: "🏃‍♂️", name: "BOT" },
      correct: false,
      system: true,
    });
    expect(sendRoomUpdate).toBeCalledWith(io, "testRoom");
  });

  it("should remove player from all rooms when disconnected", () => {
    socket.socketClient.emit("disconnect");
    expect(Players.removeFromAllRooms).toBeCalledWith(socket);
  });
});
