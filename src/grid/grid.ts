import { Entity, Vector2D } from '@/utils'
import { Node } from '@/node'
import { Settings } from '@/settings'
import { InputBox } from '@/input-box'
import { GridOnKeyPressComponent } from './components'
import { Timer } from '@/timer'

export class Grid extends Entity {

    private _nodes: Node[] = []
    private _input: InputBox
    private _timer: Timer
    private _score: number

    public get Nodes(): Node[] {
        return this._nodes
    }

    public get InputText(): string { 
        return this._input.Text
    }

    public get Input(): InputBox { 
        return this._input
    }

    public get Score(): number { 
        return this._score 
    }

    public setScore(score: number): void {
        this._score=score
        Settings.grid.correctDelay=200/(0.05*score+1.5)+300
        Settings.grid.delayBetweenNodes=20/(0.05*score+1.5)+20
    }

    public Awake(): void{ 
        
        this.AddComponent(new GridOnKeyPressComponent())

        super.Awake() 
        this._score=0

        this.InitNodes() //and _input
        this._input.Awake()
        this._timer.Awake()
        // awake children
        for (const node of this._nodes) { 
            node.Awake()
        }

    }

    private InitNodes(): void {
        const size = Settings.grid.nodeSize 
        const offset = Settings.grid.nodeOffset 
        for (let y=0; y < Settings.grid.dimension; y++) {
            for (let x = 0; x < Settings.grid.dimension; x++) {
                const start = new Vector2D(
                    x * (size + offset) + offset,
                    y * (size + offset) + offset+size+offset
                )

                const end = new Vector2D(
                    start.x + size, 
                    start.y + size
                )

                const index = new Vector2D(x,y)
                
                //pick a letter
                const letters=Settings.alphabet.letters 
                const p=Settings.alphabet.p 
                const u=Math.random()
                let total=p[0]
                let i=0
                while (total<u || i>25) {
                    i++
                    total+=p[i]
                }
                const letter=letters[i]
                
                const node = new Node(start,end,index,letter)
                this._nodes.push(node)
            }
        }
        this._input = new InputBox(
            new Vector2D(Settings.grid.nodeOffset,Settings.grid.nodeOffset*(Settings.grid.dimension+1)+Settings.grid.nodeSize*Settings.grid.dimension+Settings.grid.nodeSize+Settings.grid.nodeOffset), 
            new Vector2D((Settings.grid.nodeSize + Settings.grid.nodeOffset) * Settings.grid.dimension + Settings.grid.nodeOffset, (Settings.grid.nodeSize + Settings.grid.nodeOffset) * (Settings.grid.dimension+1) + Settings.grid.nodeOffset+Settings.grid.nodeSize+Settings.grid.nodeOffset),
            'Type!'
            )
        this._timer = new Timer(
            new Vector2D(Settings.grid.nodeOffset,Settings.grid.nodeOffset),
            new Vector2D((Settings.grid.nodeSize + Settings.grid.nodeOffset) * Settings.grid.dimension + Settings.grid.nodeOffset, Settings.grid.nodeOffset+Settings.grid.nodeSize+Settings.grid.nodeOffset),
            Date.now()+15000)
    }

    public Update(deltaTime: number): void { 
        //update components
        super.Update(deltaTime)

        //update children
        for (const node of this._nodes) { 
            node.Update(deltaTime)
        }
        this._input.Update(deltaTime)
        this._timer.Update(deltaTime)
    }

    public WordInGrid(word: string): false | number[]{ 
        let b_flat = new Array(Settings.grid.dimension**2)
        let i=0
        this.Nodes.forEach(node => {
            b_flat[i]=node.Letter
            i++
        });
        for (let i=0; i<b_flat.length; i++) {
            if (b_flat[i]==word[0]) {
                let check = this.NextLetters(word.slice(1),b_flat,[i])
                if (check) {
                    return check
                }
            }
        }
        return false
    }

    public NextLetters(letters: string, b_flat: string[], found: number[]) : number[] | false {
        if (letters.length==0) {
            return found 
        }
        let current_pos = found.at(-1)
        if (typeof current_pos === 'undefined') { throw new Error}
        let next_letter = letters[0]
        let i = 0
        let pos = current_pos 
        let check : false | number[]
        check=false 
        let dim=Settings.grid.dimension
        let offsets=[-1,1,dim-1,dim,dim+1,-dim-1,-dim,-dim+1]
        if (current_pos%dim == dim-1) {
            //right side
            offsets=[-1,dim-1,dim,-dim,-dim-1]
        }
        if (current_pos%dim == 0) {
            offsets=[1,dim,dim+1,-dim,-dim+1]
        }
        while (i<offsets.length) { 
            pos=current_pos+offsets[i]
            if (!(found.includes(pos)) && pos>=0 && pos<b_flat.length && b_flat[pos]==next_letter) {
                let copyfound=found.slice().concat([pos])
                check=this.NextLetters(letters.slice(1),b_flat,copyfound)
                if (check) {
                    return check
                }
            }
            i++
        }
        return check

    }
    
    public RefreshLetters(positions:number[]) {
        let i=0 
        for (i=0; i<positions.length;i++) {
            let p = this.GetProbabilities() //bugged - does not update probabilities as new letters changed
            const letters=Settings.alphabet.letters 
            const u=Math.random()
            let total=p[0]
            let k=0
            while (total<u || k>25) {
                k++
                total+=p[k]
            }
            //this.Nodes[positions[i]].Letter=letters[k]
            this.Nodes[positions[i]].ChangeTo(letters[k],i*Settings.grid.delayBetweenNodes)
        }
    }

    public GetProbabilities(): number[]{
        let counts = new Map<string,number>()
        Settings.alphabet.letters.forEach(l => {
            counts.set(l,0)
        });
        let total=0
        this.Nodes.forEach(node => {

            let current = counts.get(node.Letter)
            if (!(typeof current === 'undefined')) {
                counts.set(node.Letter,current+1)
                total++
            }

        });
        //console.log(counts)
        let p = new Array<number>(25)
        let p_total=0
        Settings.alphabet.letters.forEach(l=> {
            let count=counts.get(l)
            if (!(typeof count === 'undefined')) {
                let regular_p=Settings.alphabet.p[Settings.alphabet.letters.indexOf(l)]
                if (count/total>regular_p) {
                    //overrepresented 
                    p[Settings.alphabet.letters.indexOf(l)]=0
                } else {
                    p[Settings.alphabet.letters.indexOf(l)]=regular_p
                    p_total+=regular_p
                }
            }
        })
        //console.log(p)
        //normalize
        for (let i=0; i<p.length; i++) {
            p[i]=p[i]/p_total
        }
        //console.log(p)
        return p
    }

    public AddTime(amount: number) {
        this._timer.AddTime(amount)
        console.log(amount)
    }

}