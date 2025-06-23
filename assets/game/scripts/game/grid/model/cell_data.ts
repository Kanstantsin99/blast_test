import {Block, BlockState} from "./block";
import Vec2 = cc.Vec2;

export enum CellType {
    None= 0,
    Empty= 1,
    Filled= 2
}

export class CellData {
    private type: CellType;
    private block: Block;
    constructor(public position: Vec2) {
        this.type = CellType.Empty;
    }

    public setData(block: Block) {
        this.block = block;
        this.type = CellType.Filled;
    }

    public getBlock(): Block {
        return this.block;
    }

    public takeBlock(): Block
    {
        this.type = CellType.Empty;
        let block = this.block
        this.block = null;
        return block;
    }

    public destroyBlock()
    {
        this.block.state.value = BlockState.Destroying;
        this.type = CellType.Empty;
    }

    public getType(): CellType
    {
        return this.type;
    }

    public setType(CellType: CellType) {
        this.type = CellType;
    }
}