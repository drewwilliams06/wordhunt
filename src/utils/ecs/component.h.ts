import { Entity } from './entity'
import { IUpdate,IAwake } from '@/utils'

export interface IComponent extends IUpdate,IAwake{
    Entity: Entity | null
}