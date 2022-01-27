import { Entity,IComponent, Vector2D } from '@/utils'

export abstract class OnKeyPressComponent implements IComponent { 
    public abstract Entity: Entity | null; 

    public abstract Awake(): void 
    public abstract Update(deltaTime: number): void 
    public abstract KeyPressed(key: string): void
}