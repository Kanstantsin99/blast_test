import {Block, BlockState} from "./block";
import Vec2 = cc.Vec2;

export enum CellType {
    None= 0,
    Empty= 1,
    Filled= 2
}

export class CellData
{
    private _type: CellType;
    private _block: Block;

    constructor(public position: Vec2)
    {
        this._type = CellType.Empty;
    }

    public setBlock(block: Block)
    {
        this._block = block;
        this._type = CellType.Filled;
    }

    public setType(CellType: CellType)
    {
        this._type = CellType;
    }

    public getBlock(): Block
    {
        return this._block;
    }

    public getType(): CellType
    {
        return this._type;
    }

    public takeBlock(): Block
    {
        this._type = CellType.Empty;
        let block = this._block
        this._block = null;
        return block;
    }

    public free()
    {
        this._block.state.value = BlockState.Destroying;
        this._type = CellType.Empty;
    }
}