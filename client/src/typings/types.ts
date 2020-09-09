export interface Player {
  name: string
  emoji: string
}

export interface Players {
  [id: string]: Player
}

export interface Category {
  name: string
  icon: string
  include: boolean
}

export interface Categories {
  [category: string]: Category
}

export interface GameSettings {
  scoreLimit: number
  selectedCategories: Categories
}
