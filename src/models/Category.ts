export interface SubCategory {
  name: string
  items: string[]
}

export interface MainCategory {
  name: string
  icon: string
  subCategories: SubCategory[]
}
