export class Font {
    public readonly Height: number 
    public readonly Typeface: string 

    constructor (height: number, typeface: string) {
        this.Height=height 
        this.Typeface=typeface
    }

    public AsString(): string { 
        return `${this.Height}px ${this.Typeface}`
    }
} 