export default class SpeciesGenre {
    uuid: string
    created_at: Date
    updated_at: Date
    user: string
    name: string
    category: string

    constructor(speciesGenre: Array<string>) {
        this.uuid = speciesGenre.hasOwnProperty('uuid') ? speciesGenre['uuid'] : ''
        this.created_at = speciesGenre.hasOwnProperty('created_at') ? speciesGenre['created_at'] : ''
        this.updated_at = speciesGenre.hasOwnProperty('updated_at') ? speciesGenre['updated_at'] : ''
        this.user = speciesGenre.hasOwnProperty('user') ? speciesGenre['user'] : ''
        this.name = speciesGenre.hasOwnProperty('name') ? speciesGenre['name'] : ''
        this.category = speciesGenre.hasOwnProperty('category') ? speciesGenre['category'] : ''
    }

    toJSON() {
        return {...this} // here I make a POJO's copy of the class instance
    }
}
