import Vec2 = cc.Vec2;
import {IService} from "../../../utils/service_locator/i_service";
import {Block} from "./block";
import {Postponer} from "../../../utils/postponer/postpener";
import {Durations} from "../../../durations";

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

    public getType(): CellType
    {
        return this.type;
    }

    public setType(CellType: CellType) {
        this.type = CellType;
    }

}

export enum GridState
{
    None = 0,
    Idle = 1,
    DestroyingMatches = 2,
    Collapsing = 3
}

export class Grid implements IService
{
    private gridSize: Vec2;
    private cells: CellData[][];
    private blocks: Block;
    private width: number;
    private height: number;
    private gridState: GridState;
    private matches: CellData[];

    public setData(gridSize: Vec2)
    {
        this.gridSize = gridSize;
        this.width = Math.floor(gridSize.x);
        this.height = Math.floor(gridSize.y);
        this.cells = this.initArray();
        this.gridState = GridState.Idle;
    }

    private initArray(): CellData[][] {
        const array: CellData[][] = new Array<CellData[]>(this.width);
        for (let i = 0; i < this.width; i++) {
            array[i] = new Array<CellData>(this.height);
            for (let j = 0; j < this.height; j++) {
                array[i][j] = new CellData(new Vec2(i, j));
                const random_type: number = cc.math.randomRangeInt(1,5);
                const block = new Block(random_type);
                array[i][j].setData(block);
            }
        }
        return array;
    }

    public getGridSize(): Vec2 {
        return this.gridSize;
    }

    public getCells(): CellData[][] {
        return this.cells;
    }

    private getAdjacentMatches(startPos: Vec2): CellData[] {
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
        console.log("Current grid state: " + this.gridState);
        switch(this.gridState)
        {
            case GridState.None:
                break;
            case GridState.Idle:
                Postponer.sequence()
                    .do(() => this.destroyMatches())
                    .wait(() =>
                        new Promise(resolve =>
                            setTimeout(resolve, Durations.Destroying * 1000)))
                    .do(() => this.switchState());
                break;
            case GridState.DestroyingMatches:
                Postponer.sequence()
                    .do(() => this.collapse())
                    .wait(() =>
                        new Promise(resolve =>
                            setTimeout(resolve, Durations.Collapsing * 1000)))
                    .do(() => this.switchState());
                break;
            case GridState.Collapsing:
                this.gridState = GridState.Idle;
                break;
        }
    }

    public match_at(cellPos: Vec2): void
    {
        if (this.gridState != GridState.Idle)
        {
            return;
        }

        const clickedCell: CellData = this.cells[cellPos.x][cellPos.y];
        const matches = this.getAdjacentMatches(cellPos);
        if (matches.length > 2)
        {
            this.matches = matches;
            this.switchState()
        }
    }

    private destroyMatches(): void
    {
        this.gridState = GridState.DestroyingMatches;

        for (const cellData of this.matches)
        {
            cellData.getBlock().destroy();
            cellData.setType(CellType.Empty);
        }
    }

    private collapse(): void
    {
        this.gridState = GridState.Collapsing;

        // 1. Find Bottom Empty Cells
        // 2. Take Top

        var columns: number[] = new Array<number>();
        for (const cellData of this.matches)
        {
            if (!columns.includes(cellData.position.y))
            {
                columns.push(cellData.position.y)
            }
        }
    }
}
