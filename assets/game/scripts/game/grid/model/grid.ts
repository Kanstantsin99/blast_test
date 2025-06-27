import {IService} from "../../../utils/service_locator/i_service";
import Vec2 = cc.Vec2;
import {CellData, CellType} from "./cell_data";
import {Block, BlockState} from "./block";
import {ReactiveProperty} from "../../../utils/types/reactive_property";

export const IGrid = Symbol("IGrid");
export enum GridState
{
    None = 0,
    Collapsed = 1,
    Destroyed = 2,
    WaitingInput = 3,
    Matching = 4
}

export interface IGrid extends IService
{
    state: ReactiveProperty<GridState>;

    getGridSize(): Vec2;
    getCells(): CellData[][];
    collapse(): void;
    prepare(): boolean;
    destroy(): void;
    destroyMatches(): void;
    savePositions(): void;
    getMatches(): CellData[];
}

export class Grid implements IGrid
{
    private readonly _gridSize: Vec2;
    private readonly _cells: CellData[][];
    private readonly _blocks: Block[];
    private readonly _width: number;
    private readonly _height: number;
    private readonly _poolSize: number;
    private _matches: CellData[];
    private _isInput: boolean;

    public state: ReactiveProperty<GridState>;

    public constructor(gridSize: Vec2)
    {
        this._gridSize = gridSize;
        this._width = Math.floor(gridSize.x);
        this._height = Math.floor(gridSize.y);
        this._poolSize = 2 * this._width * this._height;
        this._cells = this.initCellsArray();
        this._blocks = this.initBlocksArray();
        this._isInput = false;
        this.state = new ReactiveProperty<GridState.None>;
    }

    public getGridSize(): Vec2
    {
        return this._gridSize;
    }

    public getCells(): CellData[][]
    {
        return this._cells;
    }

    public getMatches(): CellData[]
    {
        return this._matches;
    }

    public collapse(): void
    {
        // Left->Right Bottom->Top
        for (let i = 0; i < this._width; i++) {
            for (let j = this._height - 1; j >= 0; j--)
            {
                const emptyCell = this._cells[i][j];
                if (emptyCell.getType() == CellType.Empty)
                {
                    // Move Down or Spawn
                    for (let row = j - 1; row >= 0; row--)
                    {
                        const filledCellAbove = this._cells[i][row];
                        if (filledCellAbove.getType() != CellType.Empty)
                        {
                            this.move(filledCellAbove, emptyCell);
                            break;
                        }
                    }
                    if (emptyCell.getType() == CellType.Empty)
                    {
                        this.spawn(emptyCell);
                    }
                }
            }
        }

        this.state.value = GridState.Collapsed;
    }

    public prepare(): boolean
    {
        let hasMatches = false;

        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++)
            {
                const cell = this._cells[i][j];
                const matches = this.getAdjacentMatches(cell.position);
                if (matches.length >= 3)
                {
                    hasMatches = true;
                    break;
                }
            }
            if (hasMatches) break;
        }

        return !hasMatches;
    }

    public destroy(): void
    {
        for (let i = 0; i < this._gridSize.x; i++)
        {
            for (let j = 0; j < this._gridSize.y; j++)
            {
                this._cells[i][j].free();
            }
        }

        this.state.value = GridState.Destroyed;
    }

    public restart(): void
    {
        cc.game.end();
    }

    private initCellsArray(): CellData[][]
    {
        const array: CellData[][] = new Array<CellData[]>(this._width);

        for (let i = 0; i < this._width; i++) {
            array[i] = new Array<CellData>(this._height);
            for (let j = 0; j < this._height; j++) {
                array[i][j] = new CellData(new Vec2(i, j));
            }
        }
        return array;
    }

    private initBlocksArray(): Block[]
    {
        const array: Block[] = new Array<Block>(this._poolSize);

        for (let i = 0; i < this._poolSize; i++) {
            array[i] = new Block(1);
        }
        return array;
    }

    private getAdjacentMatches(startPos: Vec2): CellData[]
    {
        const startCell = this._cells[startPos.x][startPos.y];
        const targetType = startCell.getBlock().type;
        const visited = new Set<string>();
        const matchedCells: CellData[] = [];

        const directions = [
            new Vec2(0, 1),   // up
            new Vec2(1, 0),   // right
            new Vec2(0, -1),  // down
            new Vec2(-1, 0)   // left
        ];

        const inBounds = (x: number, y: number) => {
            return x >= 0 && x < this._width && y >= 0 && y < this._height;
        };

        const dfs = (pos: Vec2) => {
            const key = `${pos.x},${pos.y}`;
            if (visited.has(key)) return;
            visited.add(key);

            const cell = this._cells[pos.x][pos.y];
            if (cell.getBlock().type !== targetType) return;

            matchedCells.push(cell);

            for (const dir of directions) {
                const nx = pos.x + dir.x;
                const ny = pos.y + dir.y;
                if (inBounds(nx, ny)) {
                    dfs(new Vec2(nx, ny));
                }
            }
        };

        dfs(startPos);
        return matchedCells;
    }

    public matchAt(cellPos: Vec2): void
    {
        if (this.state.value != GridState.WaitingInput) return;

        const matches = this.getAdjacentMatches(cellPos);
        if (matches.length > 2)
        {
            this._matches = matches;
            this.state.value = GridState.Matching;
        }
        else
        {
            this._cells[cellPos.x][cellPos.y].getBlock().state.value = BlockState.Clicked;
        }
    }

    public destroyMatches(): void
    {
        for (const cellData of this._matches)
        {
            cellData.free();
        }
    }

    private move(from: CellData, to: CellData)
    {
        let block = from.takeBlock()
        block.state.value = BlockState.Moving
        to.setBlock(block)
    }

    private spawn(to: CellData)
    {
        let block = this.getBlockFromPool();
        block.state.value = BlockState.Spawning;
        block.type = cc.math.randomRangeInt(1, 5);
        block.position = null;
        to.setBlock(block);
    }

    private getBlockFromPool() : Block
    {
        for (let i = 0; i < this._poolSize; i++) {
            if (!this._blocks[i].inUse) {
                let block: Block = this._blocks[i];
                block.inUse = true;
                return block;
            }
        }

        console.error("No free blocks in BlockModelPool")
        return new Block(1);
    }

    public savePositions(): void
    {
        for (let i = 0; i < this._gridSize.x; i++)
        {
            for (let j = 0; j < this._gridSize.y; j++)
            {
                this._cells[i][j].getBlock().position = new Vec2(i, j);
            }
        }
    }
}
