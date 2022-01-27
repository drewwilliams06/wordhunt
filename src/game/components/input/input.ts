import { Game } from '@/game' 
import { IComponent,OnKeyPressComponent } from '@/utils'

export class GameInputComponent implements IComponent {
    public Entity: Game; 
        
    public Awake(): void {
        document.body.addEventListener('keydown', this.handleKeyPress.bind(this))
    }

    public Update(deltaTime: number): void { 

    }

    private handleKeyPress(e: KeyboardEvent): void { 

        console.log("Game saw keypress")
        const key = e.key

        for (const entity of this.Entity.Entities) { 
            if (!entity.HasComponent(OnKeyPressComponent)) { 
                continue 
            }
            entity.GetComponent(OnKeyPressComponent).KeyPressed(key)
        }
        
    }
}