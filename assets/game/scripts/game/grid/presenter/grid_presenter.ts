import {ServiceLocator} from "../../../utils/service_locator/service_locator";
import {Grid, GridState} from "../model/grid";
import {BlockFactory} from "../model/block_factory";
import Vec2 = cc.Vec2;
import {Block, BlockState} from "../model/block";
import {CellData} from "../model/cell_data";
import Prefab = cc.Prefab;
import BlockPresenter from "./block_presenter";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GridPresenter extends cc.Component {

    @property(cc.Node)
    gridNode: cc.Node = null;

    private grid: Grid;
    private gridSize: Vec2;
    private blockFactory: BlockFactory;
    private cellSize: Vec2;
    private cellSpeed: number = 10; // cells pre sec
    private blockPresenters : Map<Block, cc.Node>;

    protected onLoad()
    {
        this.gridNode.on(cc.Node.EventType.MOUSE_DOWN, function (event: cc.Event.EventMouse) {
            const localPos = this.gridNode.convertToNodeSpaceAR(event.getLocation());
            const cellPos = this.pixel_to_grid(localPos);
            this.grid.match_at(cellPos);
        }, this);
    }

    protected start()
    {
        this.blockPresenters = new Map<Block, cc.Node>();
        this.grid = ServiceLocator.get(Grid);
        this.gridSize = this.grid.getGridSize();
        this.blockFactory = ServiceLocator.get(BlockFactory);
        this.cellSize = new Vec2(0, 0);
        this.setCellSize();

        this.grid.gridState.subscribe((val) => this.onGridStateChanged(val))
    }

    private setCellSize()
    {
        let gridSize = this.grid.getGridSize();
        this.cellSize.x = Math.floor(this.gridNode.width / gridSize.x);
        this.cellSize.y = Math.floor(this.gridNode.height / gridSize.y);
    }

    // private spawnBlocks()
    // {
    //     for (let i = 0; i < this.gridSize.x; i++) {
    //         for (let j = this.gridSize.y - 1; j >= 0; j--)
    //         {
    //             this.spawnBlock(i, j);
    //         }
    //     }
    // }

    private collapse()
    {
        let cells = this.grid.getCells();

        for (let i = 0; i < this.gridSize.x; i++)
        {
            for (let j = this.gridSize.y - 1; j >= 0; j--)
            {
                let cell: CellData = cells[i][j];
                let block: Block = cell.getBlock();

                if (!block.position)
                {
                    this.spawnBlock(block, cell.position);
                    this.move(block, cell.position);
                    continue;
                }

                if (block.position != cells[i][j].position)
                {
                    this.move(block, cell.position);
                }
            }
        }
    }

    private spawnBlock(block: Block, pos: Vec2) {
        const startPos = this.grid_to_pixel(pos.x, -1);

        let node = this.blockFactory.create(
            block,
            this.gridNode,
            startPos
        );
        this.blockPresenters.set(block, node);
    }

    private move(block: Block, to: Vec2): void
    {
        const gridHeight = this.gridSize.y;
        const cellSpeed = this.cellSpeed;
        const totalCells = gridHeight + 1;
        const duration = totalCells / cellSpeed;
        const delayTime = (gridHeight - 1 - to.y) / cellSpeed;
        const endPos = this.grid_to_pixel(to.x, to.y);

        let blockPrefab = this.blockPresenters.get(block);

            cc.tween(blockPrefab)
                .delay(delayTime)
                .to(
                    duration,
                    {position: endPos}
                )
                .start();
    }

    private grid_to_pixel(column: number, row: number): Vec2
    {
        const new_x = this.cellSize.x * column;
        const new_y = - this.cellSize.y * row;
        return new Vec2(new_x, new_y);
    }

    private pixel_to_grid(position: Vec2): Vec2
    {
        const column: number = Math.floor(position.x / this.cellSize.x)
        const row: number = Math.floor(position.y / - this.cellSize.y);
        return new Vec2(column, row);
    }

    private destroyMatches()
    {
        for (let cell of this.grid.matches)
        {
            let block = cell.getBlock();
            this.blockPresenters.get(block).getComponent(BlockPresenter).inUse = false;
            block.inUse = false;
        }
    }

    private onGridStateChanged(state: GridState)
    {
        console.log("onGridStateChange: ", state);
        switch (state)
        {
            case GridState.None:
                break;
            case GridState.Idle:
                break;
            case GridState.DestroyingMatches:
                this.destroyMatches();
                break;
            case GridState.Collapsing:
                this.collapse();
                break;
        }
    }
}
