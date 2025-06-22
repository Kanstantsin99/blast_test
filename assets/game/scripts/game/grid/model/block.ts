import {ReactiveProperty} from "../../../utils/types/reactive_property";

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
    Collapsing = 3
}

export class Block {
    public type: BlockType;
    public state: ReactiveProperty;
    public inUse: boolean;

    constructor(type: BlockType) {
        this.type = type;
        this.state = new ReactiveProperty();
        this.state.value = BlockState.Idle;
        this.inUse = false;
    }

    destroy()
    {
        this.state.value = BlockState.Destroying;
    }
}
