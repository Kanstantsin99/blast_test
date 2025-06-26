import {ServiceLocator} from "../../../utils/service_locator/service_locator";
import {BlockFactory} from "../model/block_factory";
import {Block} from "../model/block";
import {CellData} from "../model/cell_data";
import {IGrid} from "../model/grid";
import Vec2 = cc.Vec2;


const {ccclass, property} = cc._decorator;

@ccclass
export default class GridPresenter extends cc.Component {

    @property(cc.Node)
    gridNode: cc.Node = null;

    private grid: IGrid;
    private gridSize: Vec2;
    private blockFactory: BlockFactory;
    private cellSize: Vec2;
    private cellSpeed: number = 1500;
    private blockPresenters : Map<Block, cc.Node>;

    protected onLoad()
    {
        this.onMouseClick();
    }

    protected start()
    {
        this.blockPresenters = new Map<Block, cc.Node>();
        this.grid = ServiceLocator.get(IGrid);
        this.gridSize = this.grid.getGridSize();
        this.blockFactory = ServiceLocator.get(BlockFactory);
        this.cellSize = new Vec2(0, 0);
        this.setCellSize();

        // this.grid.gridState.subscribe((val) => this.onGridStateChanged(val))
    }

    // private onGridStateChanged(state: GridStates)
    // {
    //     console.log("onGridStateChange: ", state);
    //     switch (state)
    //     {
    //         case GridStates.None:
    //             break;
    //         case GridStates.Idle:
    //             break;
    //         case GridStates.DestroyingMatches:
    //             this.destroyMatches();
    //             break;
    //         case GridStates.Collapsing:
    //             this.collapse();
    //             break;
    //     }
    // }

    private setCellSize()
    {
        let gridSize = this.grid.getGridSize();
        this.cellSize.x = Math.floor(this.gridNode.width / gridSize.x);
        this.cellSize.y = Math.floor(this.gridNode.height / gridSize.y);
    }

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
        node.width = this.cellSize.x;
        node.height = this.cellSize.y;
        this.blockPresenters.set(block, node);
    }

    private move(block: Block, to: Vec2): void
    {
        const height = this.gridSize.y + 1
        let blockPresenter = this.blockPresenters.get(block);

        if (!block.position)
        {
            block.position = new Vec2(to.x, - (height - to.y));
        }
        const startPos = this.grid_to_pixel(block.position.x, block.position.y);
        const endPos = this.grid_to_pixel(to.x, to.y);

        const distance: number = endPos.sub(startPos).mag();
        const duration = distance / this.cellSpeed;

        blockPresenter.setPosition(startPos.x, startPos.y);
        cc.tween(blockPresenter)
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

    // private destroyMatches()
    // {
    //     for (let cell of this.grid.matches)
    //     {
    //         let block = cell.getBlock();
    //         this.blockPresenters.get(block).getComponent(BlockPresenter).inUse = false;
    //         block.inUse = false;
    //     }
    // }

    private onMouseClick() {
        this.gridNode.on(cc.Node.EventType.MOUSE_DOWN, function (event: cc.Event.EventMouse) {
            const localPos = this.gridNode.convertToNodeSpaceAR(event.getLocation());
            const cellPos = this.pixel_to_grid(localPos);
            this.grid.matchAt(cellPos);
        }, this);
    }
}
