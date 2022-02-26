import Theme from "../../../utils/Theme";

export default class BaseHeaderModel {

    readonly DEFAULT_DISPLAY_SIZE: string = 'xxxl'
    readonly DEFAULT_SIZE: string = Theme.HEADER_SIZES()['h1']
    readonly DEFAULT_COLOR: string = 'black'

    private _content: string
    private _displaySize: string
    private _size: string
    private _color: string
    private _additionalClasses: string = ''

    constructor(content: string) {
        this._content = content
        this._displaySize = this.DEFAULT_DISPLAY_SIZE
        this._size = this.DEFAULT_SIZE
        this._color = this.DEFAULT_COLOR
    }

    public setContent(content: string): BaseHeaderModel{
        this._content = content
        return this
    }

    public getContent(): string{
        return this._content
    }

    public setColorOrTrowError(color: string): BaseHeaderModel{
        if(Theme.TEXT_COLORS().hasOwnProperty(color) === false){
            throw new Error('Unexpected color "'+color+'"')
        }

        this._color = color
        return this
    }

    public getColor(): string{
        return Theme.TEXT_COLORS()[this._color]
    }

    public setDisplaySizeOrTrowError(displaySize: string): BaseHeaderModel{
        if(Theme.TEXT_DISPLAY_SIZES().hasOwnProperty(displaySize) === false){
            throw new Error('Unexpected displaySize "'+displaySize+'"')
        }

        this._displaySize = displaySize
        return this
    }

    public getDisplaySize(): string{
        return Theme.TEXT_DISPLAY_SIZES()[this._displaySize]
    }

    public setSizeOrTrowError(size: string): BaseHeaderModel{
        if(Theme.HEADER_SIZES().hasOwnProperty(size) === false){
            throw new Error('Unexpected size "'+size+'"')
        }

        this._size = size
        return this
    }

    public getSize(): string{
        return this._size
    }

    get additionalClasses(): string {
        return this._additionalClasses;
    }

    set additionalClasses(value: string) {
        this._additionalClasses = value;
    }
}