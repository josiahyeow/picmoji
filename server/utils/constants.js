const DEFAULT_SCORE_LIMIT = 10;
const DEFAULT_SELECTED_CATEGORIES = {
  general: { name: "General", icon: "💬", include: true },
  movies: { name: "Movies", icon: "🍿", include: false },
  tv: { name: "TV Shows", icon: "📺", include: false },
  songs: { name: "Music", icon: "🎵", include: false },
  places: { name: "Places", icon: "🌏", include: false },
  brands: { name: "Brands", icon: "🛍", include: false },
  anime: { name: "Anime", icon: "🇯🇵", include: false },
  koreaboo: { name: "Koreaboo", icon: "🇰🇷", include: false },
};

const GAME_MODES = {
  CLASSIC: "classic",
  PICTIONARY: "pictionary",
};

module.exports = {
  DEFAULT_SCORE_LIMIT,
  DEFAULT_SELECTED_CATEGORIES,
  GAME_MODES,
};
