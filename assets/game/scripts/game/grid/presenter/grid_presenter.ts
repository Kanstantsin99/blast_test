import {ServiceLocator} from "../../../utils/service_locator/service_locator";
import {BlockFactory} from "../model/block_factory";
import {Block} from "../model/block";
import {CellData} from "../model/cell_data";
import {GridState, IGrid} from "../model/grid";
import BlockPresenter from "./block_presenter";
import Vec2 = cc.Vec2;


const {ccclass, property} = cc._decorator;

@ccclass
export default class GridPresenter extends cc.Component {

    @property(cc.Node)
    gridNode: cc.Node = null;

    private _grid: IGrid;
    private _gridSize: Vec2;
    private _blockFactory: BlockFactory;
    private _cellSize: Vec2;
    private _cellSpeed: number = 2000;
    private _blockPresenters : Map<Block, cc.Node>;

    protected onLoad()
    {
        this.onClick();
    }

    protected start()
    {
        this._blockPresenters = new Map<Block, cc.Node>();
        this._grid = ServiceLocator.get(IGrid);
        this._gridSize = this._grid.getGridSize();
        this._blockFactory = ServiceLocator.get(BlockFactory);
        this._cellSize = new Vec2(0, 0);
        this.setCellSize();

        this._grid.state.subscribe((val) => this.onGridStateChanged(val))
    }

    private onGridStateChanged(state: GridState)
    {
        switch (state)
        {
            case GridState.None:
                break;
            case GridState.Destroyed:
                this.onGridDestroy();
                break;
            case GridState.Collapsed:
                this.collapse();
                break;
            case GridState.WaitingInput:
                break;
            case GridState.Matching:
                this.destroyMatches();
                break;
        }
    }

    private setCellSize()
    {
        let gridSize = this._grid.getGridSize();
        this._cellSize.x = Math.floor(this.gridNode.width / gridSize.x);
        this._cellSize.y = Math.floor(this.gridNode.height / gridSize.y);
    }

    private collapse()
    {
        let cells = this._grid.getCells();

        for (let i = 0; i < this._gridSize.x; i++)
        {
            for (let j = this._gridSize.y - 1; j >= 0; j--)
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

        let node = this._blockFactory.create(
            block,
            this.gridNode,
            startPos
        );
        node.width = this._cellSize.x;
        node.height = this._cellSize.y;
        this._blockPresenters.set(block, node);
    }

    private move(block: Block, to: Vec2): void
    {
        const height = this._gridSize.y + 1
        let blockPresenter = this._blockPresenters.get(block);

        if (!block.position)
        {
            block.position = new Vec2(to.x, - (height - to.y));
        }
        const startPos = this.grid_to_pixel(block.position.x, block.position.y);
        const endPos = this.grid_to_pixel(to.x, to.y);

        const distance: number = endPos.sub(startPos).mag();
        const duration = distance / this._cellSpeed;

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
        const new_x = this._cellSize.x * column;
        const new_y = - this._cellSize.y * row;
        return new Vec2(new_x, new_y);
    }

    private pixel_to_grid(position: Vec2): Vec2
    {
        const column: number = Math.floor(position.x / this._cellSize.x)
        const row: number = Math.floor(position.y / - this._cellSize.y);
        return new Vec2(column, row);
    }

    private destroyMatches()
    {
        for (let cell of this._grid.getMatches())
        {
            let block = cell.getBlock();
            this._blockPresenters.get(block).getComponent(BlockPresenter).inUse = false;
            block.inUse = false;
        }
    }

    private onClick()
    {
        const handler = (event: cc.Event.EventMouse | cc.Event.EventTouch) => {
            const location = (event as any).getLocation();
            const localPos = this.gridNode.convertToNodeSpaceAR(location);
            const cellPos = this.pixel_to_grid(localPos);
            this._grid.matchAt(cellPos);
        };

        this.gridNode.on(cc.Node.EventType.MOUSE_DOWN, handler, this);
        this.gridNode.on(cc.Node.EventType.TOUCH_START, handler, this);
    }

    private onGridDestroy()
    {
        const cells = this._grid.getCells();

        for (let i = 0; i < this._gridSize.x; i++)
        {
            for (let j = 0; j < this._gridSize.y; j++)
            {
                let block = cells[i][j].getBlock();
                this._blockPresenters.get(block).getComponent(BlockPresenter).inUse = false;
                block.inUse = false;
            }
        }
    }
}
