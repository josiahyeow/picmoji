export interface Players {
  [id: string]: string
}

export interface Category {
  name: string
  include: boolean
}

export interface Categories {
  [category: string]: Category
}

export interface GameSettings {
  scoreLimit: number
  categories: Categories
}
