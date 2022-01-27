import { Color, IComponent,Vector2D,Font, Canvas } from '@/utils'
import { Node } from '@/node'
import { Settings } from '@/settings'
import { CanvasLayer } from '@/canvas-layer'

export class NodeDrawComponent implements IComponent {
    public Entity: Node 
    public BackgroundColor: Color

    public Awake(): void {
        this.BackgroundColor=Settings.grid.color
        this.Clear()
    }

    public Update(deltaTime: number): void {
        this.Clear()
        
        if (this.Entity.ChangeTime) { 
            let percentComplete = (Date.now()-this.Entity.ChangeTime)/Settings.grid.correctDelay 
            if (percentComplete<0 || percentComplete>=1) {
                this.BackgroundColor=Settings.grid.color
            } else {
                //console.log(percentComplete)
                this.BackgroundColor = new Color(Math.floor(245*percentComplete),245,Math.floor(245*percentComplete),1)
            } 
        }
        this.Draw()
    }

    private Draw(): void { 
        CanvasLayer.Background.FillRect(
            this.Entity.Start,
            this.Entity.Size,
            this.BackgroundColor
        )
        const height=this.Entity.Size.y*.8
        
        CanvasLayer.Foreground.FillLetter(new Vector2D(this.Entity.Start.x+this.Entity.Size.x/2,this.Entity.Start.y+this.Entity.Size.y*.8), new Color(0,0,0,0), this.Entity.Letter, new Font(height,'monospace'))
    }

    private Clear(): void {
        CanvasLayer.Background.ClearRect(this.Entity.Start,this.Entity.Size)
        CanvasLayer.Foreground.ClearRect(this.Entity.Start,this.Entity.Size)
    }


}