import BlockPresenter from "../presenter/block_presenter";
import {Block} from "./block";
import Prefab = cc.Prefab;
import Vec2 = cc.Vec2;

export class BlockFactory {
    private readonly prefabPath: string = "prefabs/blocks/blue_block";
    private prefab: Prefab;
    private readonly PoolSize: number;
    private readonly blocksPool: Array<BlockPresenter>;

    public constructor(gridSize: Vec2) {
        this.PoolSize = 2 * gridSize.x * gridSize.y;
        this.blocksPool = Array<BlockPresenter>(this.PoolSize);
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
                    this.blocksPool[i] = cc.instantiate(this.prefab).getComponent(BlockPresenter);
                }
            }
        });
    }

    public create(block: Block, parent: cc.Node, at: Vec2): cc.Node
    {
        for (let j = 0; j < this.PoolSize; j++)
        {
            if (!this.blocksPool[j].inUse)
            {
                this.blocksPool[j].inUse = true;
                this.blocksPool[j].setData(block);
                this.blocksPool[j].node.parent = parent;
                this.blocksPool[j].node.setPosition(at);
                return this.blocksPool[j].node;
            }
        }
    }
}
