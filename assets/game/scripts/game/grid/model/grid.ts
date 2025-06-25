import {IService} from "../../../utils/service_locator/i_service";
import {Block, BlockState} from "./block";
import {Postponer} from "../../../utils/postponer/postpener";
import {Durations} from "../../../durations";
import {ReactiveProperty} from "../../../utils/types/reactive_property";
import {CellData, CellType} from "./cell_data";
import {StateMachine} from "../../../utils/state_machine/state_machine";
import {GridState} from "./states/grid_state";
import Vec2 = cc.Vec2;


export enum GridStates
{
    None = 0,
    Idle = 1,
    DestroyingMatches = 2,
    Collapsing = 3,
    Win = 4,
    Loose = 5,
    Preparing = 6,
    Shuffling = 7,
}

export class Grid implements IService
{
    private readonly gridSize: Vec2;
    private readonly cells: CellData[][];
    private readonly blocks: Block[];
    private readonly width: number;
    private readonly height: number;
    private readonly poolSize: number;
    private readonly stateMachine: StateMachine<GridState>;

    public gridState: ReactiveProperty<GridStates>;
    public matches: CellData[];


    public constructor(gridSize: Vec2, stateMachine: StateMachine<GridState>)
    {
        this.gridSize = gridSize;
        this.stateMachine = stateMachine;

        this.width = Math.floor(gridSize.x);
        this.height = Math.floor(gridSize.y);
        this.poolSize = 2 * this.width * this.height;
        this.cells = this.initCellsArray();
        this.blocks = this.initBlocksArray();
        this.gridState = new ReactiveProperty(GridStates.DestroyingMatches);
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

    private switchState()
    {
        console.log("Previous grid state: " + this.gridState.value);
        let previousState = this.gridState.value;
        switch(previousState)
        {
            case GridStates.None:
                break;
            case GridStates.Preparing:
                Postponer.sequence()
                    .do(() => this.gridState.value = GridStates.Idle)
                break;
            case GridStates.Idle:
                Postponer.sequence()
                    .do(() => this.destroyMatches())
                    .do(() => this.gridState.value = GridStates.DestroyingMatches)
                    .wait(() =>
                        new Promise(resolve =>
                            setTimeout(resolve, Durations.Destroying * 1000)))
                    .do(() => this.switchState());
                break;
            case GridStates.DestroyingMatches:
                Postponer.sequence()
                    .do(() => this.collapse())
                    .do(() => this.gridState.value = GridStates.Collapsing)
                    .wait(() =>
                        new Promise(resolve =>
                            setTimeout(resolve, Durations.Collapsing * 3000)))
                    .do(() => this.switchState());
                break;
            case GridStates.Collapsing:
                Postponer.sequence()
                    .do(() => this.prepare())
                    .do(() => this.switchState());
                break;
            case GridStates.Shuffling:
                Postponer.sequence()
                    .do(() => this.shuffle())
                    .do(() => this.collapse())
                    .do(() => this.gridState.value = GridStates.Collapsing)
                    .wait(() =>
                        new Promise(resolve =>
                            setTimeout(resolve, Durations.Collapsing * 3000)))
                    .do(() => this.switchState());
        }
    }

    private prepare(): void
    {
        let hasMatches = false;

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++)
            {
                const cell = this.cells[i][j];
                const matches = this.getAdjacentMatches(cell.position);
                if (matches.length >= 3)
                {
                    hasMatches = true;
                    break;
                }
            }
            if (hasMatches) break;
        }

        if (hasMatches) {
            this.gridState.value = GridStates.Preparing;
            this.savePositions()
        } else {
            this.gridState.value = GridStates.Shuffling;
            this.savePositions()
        }
    }

    public matchAt(cellPos: Vec2): void
    {
        if (this.gridState.value != GridStates.Idle)
        {
            return;
        }

        const matches = this.getAdjacentMatches(cellPos);
        if (matches.length > 2)
        {
            this.switchState();
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
