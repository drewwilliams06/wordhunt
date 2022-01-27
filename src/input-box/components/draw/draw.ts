import { Color, IComponent,Vector2D,Font, Canvas } from '@/utils'
import { InputBox } from '@/input-box'
import { Settings } from '@/settings'
import { CanvasLayer } from '@/canvas-layer'

export class InputDrawComponent implements IComponent {
    public Entity: InputBox 

    public Awake(): void {
        this.Clear()
    }

    public Update(deltaTime: number): void {
        this.Clear()
        this.Draw()
    }

    private Draw(): void { 
        const height=this.Entity.Height
        CanvasLayer.Foreground.FillLetter(new Vector2D(this.Entity.Center.x,this.Entity.Center.y+Settings.grid.nodeSize*.8), new Color(0,0,0,0), this.Entity.Text, new Font(height,'monospace'))
    }

    private Clear(): void {
        CanvasLayer.Background.ClearRect(new Vector2D(this.Entity.Start.x,this.Entity.Start.y),this.Entity.Size)
        CanvasLayer.Foreground.ClearRect(new Vector2D(this.Entity.Start.x,this.Entity.Start.y),this.Entity.Size)

    }


}