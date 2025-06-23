import BlockPresenter from "../presenter/block_presenter";
import {Block} from "./block";
import Prefab = cc.Prefab;
import Vec2 = cc.Vec2;

export class BlockFactory {
    private readonly prefabPath: string = "prefabs/blocks/blue_block";
    private readonly PoolSize: number;
    private readonly pool: Array<BlockPresenter>;
    private prefab: Prefab;

    public constructor(gridSize: Vec2) {
        this.PoolSize = 2 * gridSize.x * gridSize.y;
        this.pool = Array<BlockPresenter>(this.PoolSize);
    }


    public load()
    {
        cc.resources.load(this.prefabPath, Prefab, (err: Error, prefab: cc.Prefab) => {
            if (err) {
                console.error(`Failed to load ${this.prefabPath}:`, err);
            } else {
                this.prefab = prefab;
                for (let i = 0; i < this.PoolSize; i++)
                {
                    this.pool[i] = cc.instantiate(this.prefab).getComponent(BlockPresenter);
                }
            }
        });
    }

    public create(block: Block, parent: cc.Node, at: Vec2): cc.Node {
        for (let j = 0; j < this.PoolSize; j++) {
            let instance: BlockPresenter = this.pool[j];
            if (!instance.inUse) {
                instance.inUse = true;
                instance.setData(block);
                instance.node.parent = parent;
                instance.node.setPosition(at);
                return this.pool[j].node;
            }
        }
    }
}
