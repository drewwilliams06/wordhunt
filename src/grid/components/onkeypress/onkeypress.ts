import { OnKeyPressComponent} from '@/utils'
import { Grid } from '@/grid'
import { Settings } from '@/settings'
import { Dictionary } from '@/utils'

export class GridOnKeyPressComponent extends OnKeyPressComponent { 
    public Entity: Grid 
    public dictionary: Dictionary

    public Awake(): void { 
        this.dictionary= new Dictionary()
    }

    public Update(deltaTime: number): void { 

    }

    public KeyPressed(key: string): void { 
        if (key=='Backspace') {
            this.Entity.Input.Text=this.Entity.Input.Text.slice(0,this.Entity.Input.Text.length-1)
        } else {
            if (key=='Enter') {
                // TODO: Fancy animation
                const word = this.Entity.Input.Text 
                if (this.dictionary.IsWord(word)) { 
                    this.Entity.Input.Text=""
                    let found:false|number[]=this.Entity.WordInGrid(word)
                    if (found) {
                        this.Entity.RefreshLetters(found)
                        console.log("SUCCESS")
                        this.Entity.AddTime(word.length**3/15*1000)
                        this.Entity.setScore(this.Entity.Score+word.length)
                        console.log(this.Entity.Score)
                    } else {
                        this.Entity.Input.Text = "Word not found."
                    }
                } else { 
                    this.Entity.Input.Text="Not a word!"
                }

            } else { 
                if (Settings.alphabet.letters.includes(key.toUpperCase())) {
                    
                    if (this.Entity.Input.Text=='Type!' || this.Entity.Input.Text=="Not a word!" || this.Entity.Input.Text=="Word not found.") {
                        this.Entity.Input.Text=key.toUpperCase()
                    } else { 
                        this.Entity.Input.Text += key.toUpperCase()
                    }
                }
            }
        }
    }
    


}