import {ServiceLocator} from "../../../utils/service_locator/service_locator";
import {Grid} from "../model/grid";
import {BlockFactory} from "../model/block_factory";
import Vec2 = cc.Vec2;
import easing = cc.easing;


const {ccclass, property} = cc._decorator;

@ccclass
export default class GridPresenter extends cc.Component {

    @property(cc.Node)
    gridNode: cc.Node;

    private grid: Grid;
    private blockFactory: BlockFactory;
    private cellSize: Vec2;
    private cellSpeed: number = 9; // cells pre sec

    protected onLoad() {
        this.gridNode.on(cc.Node.EventType.MOUSE_DOWN, function (event: cc.Event.EventMouse) {
            const localPos = this.gridNode.convertToNodeSpaceAR(event.getLocation());
            const cellPos = this.pixel_to_grid(localPos);
            this.grid.match_at(cellPos);
        }, this);
    }

    protected start() {
        this.grid = ServiceLocator.get(Grid);
        this.blockFactory = ServiceLocator.get(BlockFactory);
        this.cellSize = new Vec2(0, 0);
        this.setCellSize();
        this.spawnBlocks();
    }

    private setCellSize()
    {
        let gridSize = this.grid.getGridSize();
        this.cellSize.x = Math.floor(this.gridNode.width / gridSize.x);
        this.cellSize.y = Math.floor(this.gridNode.height / gridSize.y);
        console.log("cell width: ", this.cellSize.x);
        console.log("cell height: ", this.cellSize.y);
    }

    private spawnBlocks()
    {
        let gridSize = this.grid.getGridSize();
        const gridHeight   = gridSize.y;
        const cellSpeed    = this.cellSpeed;       // cells per second
        const totalCells   = gridHeight + 1;       // from spawn at row -1 down to row 0…gridHeight-1
        const duration     = totalCells / cellSpeed;

        for (let i = 0; i < gridSize.x; i++) {
            for (let j = gridHeight - 1; j >= 0; j--) {
                const startPos = this.grid_to_pixel(i, -1);
                const endPos   = this.grid_to_pixel(i, j);

                // delay so top blocks wait less, bottom blocks wait more
                // (gridHeight-1 - j) gives 0 for top row, up to gridHeight-1 for bottom
                const delayTime = (gridHeight - 1 - j) / cellSpeed;

                const node = this.blockFactory.create(
                    this.grid.getCells()[i][j].getBlock(),
                    this.gridNode,
                    startPos
                );

                cc.tween(node)
                    .delay(delayTime)                           // staggered start
                    .set({ position: startPos })                // ensure spawn pos
                    .to(
                        duration,
                        { position: endPos },
                        { easing: t => t }                         // identity easing = true linear
                    )
                    .start();
            }
        }

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


}
