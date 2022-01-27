import { Entity, Vector2D } from '@/utils'
import { Settings } from '@/settings'
import { TimerDrawComponent } from './components'

export class Timer extends Entity {
    _text: string


    public Awake(): void {
        this.AddComponent(new TimerDrawComponent())
        super.Awake()
    }

    public Update(deltaTime: number) {

        this._text=(Math.floor((this.EndTime-Date.now())/1000)).toString()
        for(const component of this._components){
            component.Update(deltaTime)
        }
    }

    constructor(
        public readonly Start: Vector2D,
        public readonly End: Vector2D,
        public EndTime: number
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
        return this.Size.y * 0.6
    }

    public get Text(): string { 
        return this._text
    }

    public AddTime(time: number) {
        this.EndTime+=time
    }

}