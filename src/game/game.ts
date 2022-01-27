import { Entity } from '@/utils'
import { Settings } from '@/settings'
import { Grid } from '@/grid'
import { GameInputComponent } from './components'

export class Game extends Entity { 
    private _lastTimestamp = 0

    // keep track of all entities
    private _entities: Entity[] = [] 

    // when game & components awake, start game loop
    public Awake(): void {
        console.log('game awake')
        this.AddComponent(new GameInputComponent())

        super.Awake() 



        // make a new grid and add to list of entities
        this._entities.push(new Grid())

        //wake up children
        for (const entity of this.Entities){
            entity.Awake()
        }

        //make sure everyone is awake before starting
        window.requestAnimationFrame(() => {
            this._lastTimestamp = Date.now()
            this.Update()
        })

    }

    public Update(): void {
        const deltaTime = (Date.now() - this._lastTimestamp) / 1000
        
        // update all components
        super.Update(deltaTime)

        // update children
        for (const entity of this.Entities){
            entity.Update(deltaTime)
        }

        this._lastTimestamp=Date.now()

        // run every frame
        window.requestAnimationFrame(()=>this.Update())
    }



    public get Entities(): Entity[] {
        return this._entities
    }



    
}