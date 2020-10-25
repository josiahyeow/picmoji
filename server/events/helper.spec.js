const SocketMock = require("socket.io-mock");
const helperEvents = require("./helper");
const Rooms = require("../actions/rooms");

jest.mock("../actions/rooms", () => ({
  add: jest.fn(),
  killAll: jest.fn(),
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
    expect(Rooms.add).toBeCalledWith(testRoom);
    expect(io.to).toBeCalledWith("testRoom");
    expect(emit).toBeCalledWith("room-repaired");
  });

  it("should kill rooms", () => {
    socket.socketClient.emit("kill-rooms");
    expect(Rooms.killAll).toBeCalled();
  });
});
