import { Settings } from '@/settings'
import { Entity,Vector2D } from '@/utils' 
import { NodeDrawComponent } from './components'

export class Node extends Entity {

    public ChangeTime: number | false
    private ChangeLetter: string

    public Awake(): void {
        this.AddComponent(new NodeDrawComponent())
        super.Awake()
    }

    public Update(deltaTime: number): void { 

        for(const component of this._components){
            component.Update(deltaTime)
        }

        if (this.ChangeTime && this.ChangeLetter) { 
            if ((Date.now()-this.ChangeTime)/Settings.grid.correctDelay > 1) {
                this.Letter=this.ChangeLetter 
            }
        }

    }

    constructor(
        public readonly Start: Vector2D,
        public readonly End: Vector2D,
        public readonly Index: Vector2D,
        public Letter: string,
    ) {
        super()
        this.ChangeTime=false
    }

    public get Size(): Vector2D { 
        return new Vector2D(
            this.End.x - this.Start.x,
            this.End.y - this.Start.y
        )
    }

    public getLetter(): string { 
        return this.Letter
    }

    public setLetter(letter: string): void { 
        this.Letter=letter
    }

    public ChangeTo(letter: string,delay: number): void { 
        this.ChangeTime=Date.now()+delay
        this.ChangeLetter=letter
    }
    
    
}