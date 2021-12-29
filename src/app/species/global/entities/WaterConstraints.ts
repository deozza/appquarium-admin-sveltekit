export default class WaterConstraints {
    uuid: string
    created_at: Date
    updated_at: Date
    user: string
    ph_min: number
    ph_max: number
    gh_min: number
    gh_max: number
    temp_min: number
    temp_max: number

    constructor(waterConstraints: Array<string>) {
        this.uuid = waterConstraints.hasOwnProperty('uuid') ? waterConstraints['uuid'] : ''
        this.created_at = waterConstraints.hasOwnProperty('created_at') ? waterConstraints['created_at'] : ''
        this.updated_at = waterConstraints.hasOwnProperty('updated_at') ? waterConstraints['updated_at'] : ''
        this.user = waterConstraints.hasOwnProperty('user') ? waterConstraints['user'] : ''
        this.ph_min = waterConstraints.hasOwnProperty('ph_min') ? waterConstraints['ph_min'] : 0
        this.ph_max = waterConstraints.hasOwnProperty('ph_max') ? waterConstraints['ph_max'] : 0
        this.temp_min = waterConstraints.hasOwnProperty('temp_min') ? waterConstraints['temp_min'] : 0
        this.temp_max = waterConstraints.hasOwnProperty('temp_max') ? waterConstraints['temp_max'] : 0
        this.gh_min = waterConstraints.hasOwnProperty('gh_min') ? waterConstraints['gh_min'] : 0
        this.gh_max = waterConstraints.hasOwnProperty('gh_max') ? waterConstraints['gh_max'] : 0
    }

    toJSON() {
        return {...this} // here I make a POJO's copy of the class instance
    }
}
