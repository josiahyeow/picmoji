const SocketMock = require("socket.io-mock");
const lobbyEvents = require("./lobby");
const rooms = require("../data/rooms");
const Players = require("../actions/players");
const Settings = require("../actions/settings");
const { sendRoomUpdate, resetRoom } = require("../utils/update-room");

jest.mock("../data/rooms", () => ({
  getRoom: jest.fn(),
}));

jest.mock("../actions/settings", () => ({
  updateScoreLimit: jest.fn(),
  updateCategories: jest.fn(),
}));

jest.mock("../actions/players", () => ({
  get: jest
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
    expect(Settings.updateScoreLimit).toBeCalled();
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
    expect(Settings.updateCategories).toBeCalled();
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
