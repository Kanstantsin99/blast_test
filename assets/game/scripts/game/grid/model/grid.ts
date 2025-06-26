import {IService} from "../../../utils/service_locator/i_service";
import Vec2 = cc.Vec2;
import {CellData, CellType} from "./cell_data";
import {Block, BlockState} from "./block";


export interface IGrid extends IService
{
    getGridSize(): Vec2;
}

export class Grid implements IGrid
{
    private readonly gridSize: Vec2;
    private readonly cells: CellData[][];
    private readonly blocks: Block[];
    private readonly width: number;
    private readonly height: number;
    private readonly poolSize: number;

    private matches: CellData[];

    public constructor(gridSize: Vec2)
    {
        this.gridSize = gridSize;

        this.width = Math.floor(gridSize.x);
        this.height = Math.floor(gridSize.y);
        this.poolSize = 2 * this.width * this.height;
        this.cells = this.initCellsArray();
        this.blocks = this.initBlocksArray();
    }

    public getGridSize(): Vec2
    {
        return this.gridSize;
    }

    public getCells(): CellData[][]
    {
        return this.cells;
    }

    private initCellsArray(): CellData[][] {
        const array: CellData[][] = new Array<CellData[]>(this.width);

        for (let i = 0; i < this.width; i++) {
            array[i] = new Array<CellData>(this.height);
            for (let j = 0; j < this.height; j++) {
                array[i][j] = new CellData(new Vec2(i, j));
            }
        }
        return array;
    }

    private initBlocksArray(): Block[]
    {
        const array: Block[] = new Array<Block>(this.poolSize);

        for (let i = 0; i < this.poolSize; i++) {
            array[i] = new Block(1);
        }
        return array;
    }

    private getAdjacentMatches(startPos: Vec2): CellData[]
    {
        const startCell = this.cells[startPos.x][startPos.y];
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
            return x >= 0 && x < this.width && y >= 0 && y < this.height;
        };

        const dfs = (pos: Vec2) => {
            const key = `${pos.x},${pos.y}`;
            if (visited.has(key)) return;
            visited.add(key);

            const cell = this.cells[pos.x][pos.y];
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

    // private prepare(): void
    // {
    //     let hasMatches = false;
    //
    //     for (let i = 0; i < this.width; i++) {
    //         for (let j = 0; j < this.height; j++)
    //         {
    //             const cell = this.cells[i][j];
    //             const matches = this.getAdjacentMatches(cell.position);
    //             if (matches.length >= 3)
    //             {
    //                 hasMatches = true;
    //                 break;
    //             }
    //         }
    //         if (hasMatches) break;
    //     }
    //
    //     if (hasMatches) {
    //         this.gridState.value = GridStates.Preparing;
    //         this.savePositions()
    //     } else {
    //         this.gridState.value = GridStates.Shuffling;
    //         this.savePositions()
    //     }
    // }

    public matchAt(cellPos: Vec2): void
    {
        // if (this.gridState.value != GridStates.Idle)
        // {
        //     return;
        // }
        return;

        const matches = this.getAdjacentMatches(cellPos);
        if (matches.length > 2)
        {
            // this.switchState();
            this.matches = matches;
        }
        else
        {
            this.cells[cellPos.x][cellPos.y].getBlock().state.value = BlockState.Clicked;
        }
    }

    private destroyMatches(): void
    {
        for (const cellData of this.matches)
        {
            cellData.destroyBlock();
        }
    }

    private collapse(): void
    {
        // Left->Right Bottom->Top
        for (let i = 0; i < this.width; i++) {
            for (let j = this.height - 1; j >= 0; j--)
            {
                const emptyCell = this.cells[i][j];
                if (emptyCell.getType() == CellType.Empty)
                {
                    // Move Down or Spawn
                    for (let row = j - 1; row >= 0; row--)
                    {
                        const filledCellAbove = this.cells[i][row];
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
    }

    private move(from: CellData, to: CellData)
    {
        let block = from.takeBlock()
        block.state.value = BlockState.Moving
        to.setData(block)
    }

    private spawn(to: CellData)
    {
        let block = this.getBlockFromPool();
        block.state.value = BlockState.Spawning;
        block.type = cc.math.randomRangeInt(1, 5);
        block.position = null;
        to.setData(block);
    }

    private getBlockFromPool() : Block
    {
        for (let i = 0; i < this.poolSize; i++) {
            if (!this.blocks[i].inUse) {
                let block: Block = this.blocks[i];
                block.inUse = true;
                return block;
            }
        }

        console.error("No free blocks in BlockModelPool")
        return new Block(1);
    }

    private savePositions(): void
    {
        for (let i = 0; i < this.gridSize.x; i++)
        {
            for (let j = 0; j < this.gridSize.y; j++)
            {
                this.cells[i][j].getBlock().position = new Vec2(i, j);
            }
        }
    }

    public restart(): void
    {
        cc.game.end();
    }

    private shuffle(): void
    {
        for (var i of this.matches)
        {
            i.destroyBlock();
        }
    }
}
