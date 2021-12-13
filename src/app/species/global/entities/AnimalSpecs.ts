export default class AnimalSpecs {
  uuid: string
  created_at: Date
  updated_at: Date
  user: string
  male_size: number
  female_size: number
  longevity_in_years: number

  constructor(animalSpecs: Array<string>) {
    this.uuid = animalSpecs.hasOwnProperty('uuid') ? animalSpecs['uuid'] : ''
    this.created_at = animalSpecs.hasOwnProperty('created_at') ? animalSpecs['created_at'] : ''
    this.updated_at = animalSpecs.hasOwnProperty('updated_at') ? animalSpecs['updated_at'] : ''
    this.user = animalSpecs.hasOwnProperty('user') ? animalSpecs['user'] : ''
    this.male_size = animalSpecs.hasOwnProperty('male_size') ? animalSpecs['male_size'] : 0
    this.female_size = animalSpecs.hasOwnProperty('female_size') ? animalSpecs['female_size'] : 0
    this.longevity_in_years = animalSpecs.hasOwnProperty('longevity_in_years') ? animalSpecs['longevity_in_years'] : 0
  }

  toJSON() {
    return {...this} // here I make a POJO's copy of the class instance
  }
}
