export default class Param {
    type: string
    name: string
    value: string | number | Array<string>

    constructor(name: string, type: string, value: string | number | Array<string>) {
        this.name = name
        this.type = type
        this.value = value
    }
}
