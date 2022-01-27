import { Entity, Vector2D } from '@/utils'
import { Node } from '@/node'
import { Settings } from '@/settings'
import { InputDrawComponent } from './components'


export class InputBox extends Entity { 

    _text: string

    public Awake(): void {
        this.AddComponent(new InputDrawComponent())
        super.Awake()
    }
    

    constructor(
        public readonly Start: Vector2D,
        public readonly End: Vector2D,
        public Text: string
    ) {
        super()
    }

    public get Size(): Vector2D { 
        return new Vector2D(
            this.End.x - this.Start.x,
            this.End.y - this.Start.y
        )
    }

    public get Center(): Vector2D {
        return new Vector2D(this.Start.x+this.Size.x/2,this.Start.y)
    }

    public get Height(): number { 
        return this.Size.y * 0.45
    }



    private InitText(): void{
        const size = Settings.grid.nodeSize 
        const offset = Settings.grid.nodeOffset 
        const height = size * .6


        
    } 


}