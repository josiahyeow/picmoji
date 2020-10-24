const rooms = require("./rooms");

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
  rooms.killRooms();
  rooms.createRoom(name);
  rooms.addPlayer(name, "aRandomId", { name: "josiah", emoji: "😀" });
  rooms.addPlayer(name, "bRandomId", { name: "gab", emoji: "😁" });
  rooms.setEmojis({
    general: [{ category: "word", emojiSet: "😀", answer: "smile" }],
    movies: [{ category: "movie", emojiSet: "😂", answer: "laugh" }],
  });
  rooms.updateScoreLimit(name, scoreLimit);
  rooms.updateCategories(name, {
    general: { name: "General", icon: "💬", include: true },
    movies: { name: "Movies", icon: "🍿", include: true },
  });
  if (start) {
    rooms.startGame(name);
  }
}

describe("Rooms", () => {
  describe("set up", () => {
    it("should set emoji sets", () => {
      rooms.setEmojis({
        general: [{ category: "word", emojiSet: "😀", answer: "smile" }],
        movies: [{ category: "movie", emojiSet: "😂", answer: "laugh" }],
      });
    });
  });

  describe("room", () => {
    it("should create new room", () => {
      expect(rooms.createRoom("foo")).toStrictEqual(testRooms["foo"]);
    });

    it("should throw error if creating a room that already exists", () => {
      expect(() => rooms.createRoom("foo")).toThrowError(
        "Room foo already exists."
      );
    });

    it("should get room", () => {
      expect(rooms.getRoom("foo")).toStrictEqual(testRooms["foo"]);
    });

    it("should throw error if room couldn't be found", () => {
      expect(() => rooms.getRoom("bar")).toThrowError(
        "Room bar could not be found."
      );
    });

    it("should get all rooms", () => {
      expect(rooms.getRooms()).toStrictEqual(testRooms);
    });

    it("should kill all rooms", () => {
      rooms.killRooms();
      expect(rooms.getRooms()).toStrictEqual({});
    });

    it("should add room", () => {
      rooms.addRoom(testRooms["foo"]);
      expect(rooms.getRoom("foo")).toStrictEqual(testRooms["foo"]);
    });
  });

  describe("player", () => {
    it("should add first player and set them as host", () => {
      rooms.addPlayer("foo", "aRandomId", { name: "josiah", emoji: "😀" });
      expect(rooms.getRoom("foo").players["aRandomId"]).toStrictEqual({
        name: "josiah",
        emoji: "😀",
        score: 0,
        pass: false,
        host: true,
      });
    });

    it("should second first player and not set them as host", () => {
      rooms.addPlayer("foo", "bRandomId", { name: "gab", emoji: "😁" });
      expect(rooms.getRoom("foo").players["bRandomId"]).toStrictEqual({
        name: "gab",
        emoji: "😁",
        score: 0,
        pass: false,
        host: false,
      });
    });

    it("should get player", () => {
      expect(rooms.getPlayer("foo", "aRandomId")).toStrictEqual({
        name: "josiah",
        emoji: "😀",
        score: 0,
        pass: false,
        host: true,
      });
    });

    it("should remove player and set new host", () => {
      rooms.removePlayer("foo", "aRandomId");
      expect(rooms.getPlayer("foo", "bRandomId").host).toBeTruthy();
    });

    it("should remove player from all rooms", () => {
      rooms.removePlayerFromAllRooms({ id: "bRandomId" });
      expect(rooms.getRoom("foo").players).toStrictEqual({});
    });
  });

  describe("settings", () => {
    it("should update score limit", () => {
      rooms.updateScoreLimit("foo", 20);
      expect(rooms.getRoom("foo").settings.scoreLimit).toBe(20);
    });

    it("should update selected categories", () => {
      const updatedCategories = {
        general: { name: "General", icon: "💬", include: true },
        movies: { name: "Movies", icon: "🍿", include: true },
      };
      rooms.updateCategories("foo", updatedCategories);
      expect(rooms.getRoom("foo").settings.selectedCategories).toStrictEqual({
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
      rooms.updateCategories("foo", {
        general: { name: "General", icon: "💬", include: false },
      });
      expect(() => rooms.startGame("foo")).toThrowError(
        "Please include at least 1 category to start the game."
      );
    });

    it("should start a new game", () => {
      rooms.startGame("foo");
      const game = rooms.getRoom("foo").game;
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
      const oldHint = rooms.getRoom("foo").game.currentEmojiSet.hint;
      rooms.updateHint("foo");
      expect(rooms.getRoom("foo").game.currentEmojiSet.hint).not.toEqual(
        oldHint
      );
    });

    it("should handle pass", () => {
      const allPassedFalse = rooms.passEmojiSet("foo", "aRandomId");
      const room = rooms.getRoom("foo");
      expect(room.players["aRandomId"].pass).toBe(true);
      expect(allPassedFalse).toBe(false);

      const allPassedTrue = rooms.passEmojiSet("foo", "bRandomId");
      const updatedRoom = rooms.getRoom("foo");
      expect(allPassedTrue).toBe(true);
      expect(updatedRoom.players["aRandomId"].pass).toBe(false);
      expect(updatedRoom.players["bRandomId"].pass).toBe(false);
    });

    it("should add point", () => {
      rooms.addPoint("foo", "aRandomId");
      expect(rooms.getRoom("foo").players["aRandomId"].score).toBe(1);
    });

    it("should check players guess", () => {
      const correctFalse = rooms.checkGuess("foo", "wrong answer");
      expect(correctFalse).toBe(false);
      const correctTrue = rooms.checkGuess(
        "foo",
        rooms.getRoom("foo").game.currentEmojiSet.answer
      );
      expect(correctTrue).toBe(true);
    });

    it("should finish game when player reaches score limit", () => {
      rooms.addPoint("foo", "aRandomId");
      expect(rooms.getRoom("foo").game.winners).not.toBeNull();
    });

    it("should reset pass and points when game is ended", () => {
      rooms.endGame("foo");
      const room = rooms.getRoom("foo");
      expect(room.players["aRandomId"].pass).toBe(false);
      expect(room.players["bRandomId"].pass).toBe(false);
      expect(room.players["aRandomId"].score).toBe(0);
      expect(room.players["bRandomId"].score).toBe(0);
      expect(room.players["aRandomId"].pass).toBe(false);
      expect(room.game).toBeNull();
    });
  });
});
