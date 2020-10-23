const SocketMock = require("socket.io-mock");
const helperEvents = require("./helper");
const rooms = require("../data/rooms");

jest.mock("../data/rooms", () => ({
  addRoom: jest.fn(),
  killRooms: jest.fn(),
}));

describe("helper events", function () {
  const io = new SocketMock();
  const emit = jest.fn();
  io.to = jest.fn().mockImplementation(() => ({ emit }));

  let socket = new SocketMock();
  socket.id = "testId";
  socket.join = jest.fn();
  socket.leave = jest.fn();
  socket.emit = jest.fn();

  helperEvents(io, socket);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should repair room", () => {
    const testRoom = { name: "testRoom", players: {} };
    socket.socketClient.emit("repair-room", testRoom);
    expect(rooms.addRoom).toBeCalledWith(testRoom);
    expect(io.to).toBeCalledWith("testRoom");
    expect(emit).toBeCalledWith("room-repaired");
  });

  it("should kill rooms", () => {
    socket.socketClient.emit("kill-rooms");
    expect(rooms.killRooms).toBeCalled();
  });
});
