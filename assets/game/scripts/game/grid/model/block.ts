import {ReactiveProperty} from "../../../utils/types/reactive_property";
import Vec2 = cc.Vec2;

export enum BlockType {
    None = 0,
    Blue = 1,
    Green = 2,
    Red = 3,
    Yellow = 4,
    Purpure = 5
}

export enum BlockState {
    None = 0,
    Idle = 1,
    Destroying = 2,
    Moving = 3,
    Spawning = 4
}

export class Block {
    public type: BlockType;
    public state: ReactiveProperty<BlockState>;
    public inUse: boolean;
    public position: Vec2;

    constructor(type: BlockType) {
        this.type = type;
        this.state = new ReactiveProperty(BlockState.Idle);
        this.inUse = false;
    }

    destroy()
    {
        this.state.value = BlockState.Destroying;
    }
}
