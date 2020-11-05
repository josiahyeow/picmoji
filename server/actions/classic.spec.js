const Rooms = require("./rooms");
const Players = require("./players");
const Player = require("./player");
const Settings = require("./settings");
const Game = require("./game");

const TEST_DEFAULT_SELECTED_CATEGORIES = {
  general: { name: "General", icon: "💬", include: true },
  movies: { name: "Movies", icon: "🍿", include: false },
  tv: { name: "TV Shows", icon: "📺", include: false },
  songs: { name: "Music", icon: "🎵", include: false },
  places: { name: "Places", icon: "🌏", include: false },
  brands: { name: "Brands", icon: "🛍", include: false },
  anime: { name: "Anime", icon: "🇯🇵", include: false },
  koreaboo: { name: "Koreaboo", icon: "🇰🇷", include: false },
};

const testRooms = {
  foo: {
    name: "foo",
    password: "",
    players: {},
    settings: {
      scoreLimit: 10,
      selectedCategories: TEST_DEFAULT_SELECTED_CATEGORIES,
      mode: "classic",
    },
    lastEvent: { type: "Room created" },
  },
};

function setUpGame(name, scoreLimit, start = true) {
  Rooms.killAll();
  Rooms.create(name);
  Players.add({ roomName: name, roomPassword: "" }, "aRandomId", {
    name: "josiah",
    emoji: "😀",
  });
  Players.add({ roomName: name, roomPassword: "" }, "bRandomId", {
    name: "gab",
    emoji: "😁",
  });
  Rooms.setEmojis({
    general: [{ category: "word", emojiSet: "😀", answer: "smile" }],
    movies: [{ category: "movie", emojiSet: "😂", answer: "laugh" }],
  });
  Settings.updateScoreLimit(name, scoreLimit);
  Settings.updateCategories(name, {
    general: { name: "General", icon: "💬", include: true },
    movies: { name: "Movies", icon: "🍿", include: true },
  });
  if (start) {
    Game.start(name);
  }
}

describe("Rooms", () => {
  describe("set up", () => {
    it("should set emoji sets", () => {
      Rooms.setEmojis({
        general: [{ category: "word", emojiSet: "😀", answer: "smile" }],
        movies: [{ category: "movie", emojiSet: "😂", answer: "laugh" }],
      });
    });
  });

  describe("room", () => {
    it("should create new room", () => {
      expect(Rooms.create("foo")).toStrictEqual(testRooms["foo"]);
    });

    it("should throw error if creating a room that already exists", () => {
      expect(() => Rooms.create("foo")).toThrowError(
        "Room foo already exists."
      );
    });

    it("should get room", () => {
      expect(Rooms.get("foo")).toStrictEqual(testRooms["foo"]);
    });

    it("should throw error if room couldn't be found", () => {
      expect(() => Rooms.get("bar")).toThrowError(
        "Room bar could not be found."
      );
    });

    it("should get all rooms", () => {
      expect(Rooms.getAll()).toStrictEqual(testRooms);
    });

    it("should kill all rooms", () => {
      Rooms.killAll();
      expect(Rooms.getAll()).toStrictEqual({});
    });

    it("should add room", () => {
      Rooms.add(testRooms["foo"]);
      expect(Rooms.get("foo")).toStrictEqual(testRooms["foo"]);
    });
  });

  describe("player", () => {
    it("should add first player and set them as host", () => {
      Players.add({ roomName: "foo", roomPassword: "" }, "aRandomId", {
        name: "josiah",
        emoji: "😀",
      });
      expect(Rooms.get("foo").players["aRandomId"]).toStrictEqual({
        name: "josiah",
        emoji: "😀",
        score: 0,
        pass: false,
        host: true,
      });
    });

    it("should second first player and not set them as host", () => {
      Players.add({ roomName: "foo", roomPassword: "" }, "bRandomId", {
        name: "gab",
        emoji: "😁",
      });
      expect(Rooms.get("foo").players["bRandomId"]).toStrictEqual({
        name: "gab",
        emoji: "😁",
        score: 0,
        pass: false,
        host: false,
      });
    });

    it("should get player", () => {
      expect(Players.get("foo", "aRandomId")).toStrictEqual({
        name: "josiah",
        emoji: "😀",
        score: 0,
        pass: false,
        host: true,
      });
    });

    it("should remove player and set new host", () => {
      Players.remove("foo", "aRandomId");
      expect(Players.get("foo", "bRandomId").host).toBeTruthy();
    });

    it("should remove player from all rooms", () => {
      Players.removeFromAllRooms({ id: "bRandomId" });
      expect(Rooms.get("foo").players).toStrictEqual({});
    });
  });

  describe("settings", () => {
    it("should update score limit", () => {
      Settings.updateScoreLimit("foo", 20);
      expect(Rooms.get("foo").settings.scoreLimit).toBe(20);
    });

    it("should update selected categories", () => {
      const updatedCategories = {
        general: { name: "General", icon: "💬", include: true },
        movies: { name: "Movies", icon: "🍿", include: true },
      };
      Settings.updateCategories("foo", updatedCategories);
      expect(Rooms.get("foo").settings.selectedCategories).toStrictEqual({
        general: { name: "General", icon: "💬", include: true },
        movies: { name: "Movies", icon: "🍿", include: true },
      });
    });
  });

  describe("start game", () => {
    beforeEach(() => {
      setUpGame("foo", 10, false);
    });

    it("should not start game if no categories are selected", () => {
      Settings.updateCategories("foo", {
        general: { name: "General", icon: "💬", include: false },
      });
      expect(() => Game.start("foo")).toThrowError(
        "Please include at least 1 category to start the game."
      );
    });

    it("should start a new game", () => {
      Game.start("foo");
      const game = Rooms.get("foo").game;
      expect(game).not.toBeNull();
      expect(game.emojiSets.length).toBe(1);
      expect(game.currentEmojiSet).not.toBeNull();
      expect(game.previousEmojiSet).toStrictEqual({
        emojiSet: "",
        answer: "",
        hint: "",
        category: "",
      });
      expect(game.scoreLimit).toBe(10);
      expect(game.lastEvent).toStrictEqual({ type: "start" });
    });
  });

  describe("in game", () => {
    beforeAll(() => {
      setUpGame("foo", 2);
    });

    it("should update hint", () => {
      const oldHint = Rooms.get("foo").game.currentEmojiSet.hint;
      Game.updateHint("foo");
      expect(Rooms.get("foo").game.currentEmojiSet.hint).not.toEqual(oldHint);
    });

    it("should handle pass", () => {
      const allPassedFalse = Player.passEmojiSet("foo", "aRandomId");
      const room = Rooms.get("foo");
      expect(room.players["aRandomId"].pass).toBe(true);
      expect(allPassedFalse).toBe(false);

      const allPassedTrue = Player.passEmojiSet("foo", "bRandomId");
      const updatedRoom = Rooms.get("foo");
      expect(allPassedTrue).toBe(true);
      expect(updatedRoom.players["aRandomId"].pass).toBe(false);
      expect(updatedRoom.players["bRandomId"].pass).toBe(false);
    });

    it("should add point", () => {
      Player.addPoint("foo", "aRandomId");
      expect(Rooms.get("foo").players["aRandomId"].score).toBe(1);
    });

    it("should check players guess", () => {
      const correctFalse = Game.checkGuess("foo", "wrong answer");
      expect(correctFalse).toBe(false);
      const correctTrue = Game.checkGuess(
        "foo",
        Rooms.get("foo").game.currentEmojiSet.answer
      );
      expect(correctTrue).toBe(true);
    });

    it("should finish game when player reaches score limit", () => {
      Player.addPoint("foo", "aRandomId");
      expect(Rooms.get("foo").game.winners).not.toBeNull();
    });

    it("should reset pass and points when game is ended", () => {
      Game.end("foo");
      const room = Rooms.get("foo");
      expect(room.players["aRandomId"].pass).toBe(false);
      expect(room.players["bRandomId"].pass).toBe(false);
      expect(room.players["aRandomId"].score).toBe(0);
      expect(room.players["bRandomId"].score).toBe(0);
      expect(room.players["aRandomId"].pass).toBe(false);
      expect(room.game).toBeNull();
    });
  });

  describe("room password", () => {
    it("should set room password", () => {
      Rooms.create("lockedRoom", "letmein");
      const room = Rooms.get("lockedRoom");
      expect(room.password).toEqual("letmein");
    });

    it("should add player to room if password is correct", () => {
      Players.add({ roomName: "lockedRoom", roomPassword: "letmein" }, "id1", {
        name: "player1",
        emoji: "🎈",
      });
      const room = Rooms.get("lockedRoom");
      expect(room.players["id1"].name).toEqual("player1");
    });

    it("should not add player to room if password is incorrect", () => {
      expect(() =>
        Players.add(
          { roomName: "lockedRoom", roomPassword: "dontletmein" },
          "id2",
          {
            name: "player2",
            emoji: "🎈",
          }
        )
      ).toThrowError("Password is incorrect.");
      const room = Rooms.get("lockedRoom");
      expect(room.players["id2"]).toBeFalsy();
    });
  });
});
