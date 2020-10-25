const SocketMock = require("socket.io-mock");
const gameEvents = require("./game");
const rooms = require("../data/rooms");
const Game = require("../actions/game");
const Player = require("../actions/player");
const Players = require("../actions/players");
const { sendRoomUpdate, resetRoom } = require("../utils/update-room");
const hintTimer = require("../utils/hint-timer");

jest.mock("../data/rooms", () => ({
  getRoom: jest.fn().mockImplementation(() => ({
    name: "testRoom",
    settings: {
      mode: "classic",
    },
    game: {
      currentEmojiSet: {
        answer: "testAnswer",
      },
    },
  })),
}));

jest.mock("../actions/game", () => ({
  start: jest.fn(),
  end: jest.fn(),
  checkGuess: jest.fn(),
  nextDrawer: jest.fn(),
  nextEmojiSet: jest.fn().mockImplementation(() => ({
    category: "testCategory",
    emojiSet: "🎈",
    answer: "testAnswer",
  })),
}));

jest.mock("../actions/players", () => ({
  get: jest
    .fn()
    .mockImplementation(() => ({ name: "testPlayer", emoji: "😀" })),
}));

jest.mock("../actions/player", () => ({
  passEmojiSet: jest.fn(),
  addPoint: jest.fn(),
}));

jest.mock("../utils/update-room", () => ({
  sendRoomUpdate: jest.fn(),
  resetRoom: jest.fn(),
}));

jest.mock("../utils/hint-timer", () => jest.fn());

describe("game events", function () {
  const io = new SocketMock();
  const emit = jest.fn();
  io.to = jest.fn().mockImplementation(() => ({ emit }));

  let socket = new SocketMock();
  socket.id = "testId";
  socket.join = jest.fn();
  socket.leave = jest.fn();
  socket.emit = jest.fn();

  gameEvents(io, socket);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should start game", () => {
    socket.socketClient.emit("start-game", "testRoom");
    expect(Game.start).toBeCalledWith("testRoom");
    expect(hintTimer).toBeCalledWith("testRoom", "testAnswer", io);
    expect(sendRoomUpdate).toBeCalled();
    expect(io.to).toBeCalledWith("testRoom");
    expect(emit).toBeCalledWith("error-message", "");
  });

  it("should end game", () => {
    socket.socketClient.emit("end-game", "testRoom");
    expect(Game.end).toBeCalledWith("testRoom");
    expect(sendRoomUpdate).toBeCalled();
    expect(io.to).toBeCalledWith("testRoom");
    expect(emit).toBeCalledWith("game-ended");
  });

  it("should acknowledge pass request", () => {
    socket.socketClient.emit("pass-emojiset", "testRoom");
    expect(Player.passEmojiSet).toBeCalledWith("testRoom", "testId");
    expect(io.to).toBeCalledWith("testRoom");
    expect(emit).toBeCalledWith("new-chat-message", {
      text: `testPlayer passed`,
      player: { name: "testPlayer", emoji: "🙅" },
      correct: false,
      system: true,
    });
    expect(sendRoomUpdate).toBeCalled();
  });

  it("should pass emoji set when all players have passed", () => {
    Player.passEmojiSet.mockImplementationOnce(() => true);
    socket.socketClient.emit("pass-emojiset", "testRoom");
    expect(Player.passEmojiSet).toBeCalledWith("testRoom", "testId");
    expect(io.to).toBeCalledWith("testRoom");
    expect(emit).toBeCalledWith("new-chat-message", {
      text: `testPlayer passed`,
      player: { name: "testPlayer", emoji: "🙅" },
      correct: false,
      system: true,
    });
    expect(hintTimer).toBeCalledWith("testRoom", "testAnswer", io);
    expect(sendRoomUpdate).toBeCalled();
  });

  it("should send guess if answer is not correct", () => {
    Game.checkGuess = jest.fn().mockReturnValue(false);
    socket.socketClient.emit("send-game-message", "testRoom", "wrong answer");
    expect(io.to).toBeCalledWith("testRoom");
    expect(emit).toBeCalledWith("new-chat-message", {
      text: "wrong answer",
      player: { name: "testPlayer", emoji: "😀" },
      correct: false,
    });
  });

  it("should give player a point and get next emoji set if answer is correct", () => {
    Game.checkGuess = jest.fn().mockReturnValue(true);
    socket.socketClient.emit("send-game-message", "testRoom", "RightAnswer");
    expect(Game.checkGuess).toBeCalledWith("testRoom", "RightAnswer");
    expect(Player.addPoint).toBeCalledWith("testRoom", "testId");
    expect(Game.nextEmojiSet).toBeCalledWith("testRoom");
    expect(hintTimer).toBeCalledWith("testRoom", "testAnswer", io);
    expect(sendRoomUpdate).toBeCalled();
    expect(io.to).toBeCalledWith("testRoom");
    expect(emit).toBeCalledWith("new-chat-message", {
      text: "RightAnswer",
      player: { name: "testPlayer", emoji: "😀" },
      correct: true,
    });
  });
});
