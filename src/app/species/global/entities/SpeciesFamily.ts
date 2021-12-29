export default class SpeciesFamily {
    uuid: string
    created_at: Date
    updated_at: Date
    user: string
    name: string
    category: string

    constructor(speciesFamily: Array<string>) {
        this.uuid = speciesFamily.hasOwnProperty('uuid') ? speciesFamily['uuid'] : ''
        this.created_at = speciesFamily.hasOwnProperty('created_at') ? speciesFamily['created_at'] : ''
        this.updated_at = speciesFamily.hasOwnProperty('updated_at') ? speciesFamily['updated_at'] : ''
        this.user = speciesFamily.hasOwnProperty('user') ? speciesFamily['user'] : ''
        this.name = speciesFamily.hasOwnProperty('name') ? speciesFamily['name'] : ''
        this.category = speciesFamily.hasOwnProperty('category') ? speciesFamily['category'] : ''
    }

    toJSON() {
        return {...this} // here I make a POJO's copy of the class instance
    }
}
