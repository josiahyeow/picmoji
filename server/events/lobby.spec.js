const SocketMock = require("socket.io-mock");
const lobbyEvents = require("./lobby");
const rooms = require("../data/rooms");
const { sendRoomUpdate, resetRoom } = require("../utils/update-room");

jest.mock("../data/rooms", () => ({
  updateScoreLimit: jest.fn(),
  updateCategories: jest.fn(),
  getRoom: jest.fn(),
  getPlayer: jest
    .fn()
    .mockImplementation(() => ({ name: "testPlayer", emoji: "😀" })),
}));

jest.mock("../utils/update-room", () => ({
  sendRoomUpdate: jest.fn(),
  resetRoom: jest.fn(),
}));

describe("lobby events", function () {
  const io = new SocketMock();
  const emit = jest.fn();
  io.to = jest.fn().mockImplementation(() => ({ emit }));

  let socket = new SocketMock();
  socket.id = "testId";
  socket.join = jest.fn();
  socket.leave = jest.fn();
  socket.emit = jest.fn();

  lobbyEvents(io, socket);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update score limit", () => {
    socket.socketClient.emit("update-setting", "testRoom", "scoreLimit", 15);
    expect(rooms.updateScoreLimit).toBeCalled();
    expect(sendRoomUpdate).toBeCalled();
  });

  it("should update selected categories", () => {
    const testCatgories = {
      aCategory: { selected: true },
    };
    socket.socketClient.emit(
      "update-setting",
      "testRoom",
      "categories",
      testCatgories
    );
    expect(rooms.updateCategories).toBeCalled();
    expect(sendRoomUpdate).toBeCalled();
  });

  it("should send chat message", () => {
    const testMessage = "hello";
    socket.socketClient.emit("send-chat-message", "testRoom", testMessage);
    expect(io.to).toBeCalledWith("testRoom");
    expect(emit).toBeCalledWith("new-chat-message", {
      text: testMessage,
      player: { name: "testPlayer", emoji: "😀" },
    });
  });
});
