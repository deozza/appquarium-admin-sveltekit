export default class Image {
    url: string
    title: string
    source: string
    file: File | null
    user: string
    associated_to: string

    constructor(image: Array<string>) {
        this.url = image.hasOwnProperty('url') ? image['url'] : ''
        this.title = image.hasOwnProperty('title') ? image['title'] : ''
        this.source = image.hasOwnProperty('source') ? image['source'] : ''
        this.user = image.hasOwnProperty('user') ? image['user'] : ''
        this.associated_to = image.hasOwnProperty('associated_to') ? image['associated_to'] : ''
        this.file = null
    }

}
