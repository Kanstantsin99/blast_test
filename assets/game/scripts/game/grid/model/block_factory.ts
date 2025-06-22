import BlockPresenter from "../presenter/block_presenter";
import {Block, BlockType} from "./block";
import Prefab = cc.Prefab;
import Vec2 = cc.Vec2;

export class BlockFactory {
    private blockPrefabPaths: Record<BlockType, string> = {
        [BlockType.None]: null,
        [BlockType.Blue]: "prefabs/blocks/blue_block",
        [BlockType.Yellow]: "prefabs/blocks/yellow_block",
        [BlockType.Red]: "prefabs/blocks/red_block",
        [BlockType.Green]: "prefabs/blocks/green_block",
        [BlockType.Purpure]: "prefabs/blocks/purpure_block",
    };

    private readonly PoolSize: number;
    private readonly prefabs: Partial<Record<BlockType, cc.Prefab>>;
    private readonly blocksPool: Array<Block>;

    public constructor(gridSize: Vec2) {
        this.PoolSize = 2 * gridSize.x * gridSize.y;
        this.prefabs = {};
        this.blocksPool = Array<Block>(this.PoolSize);
    }


    public load()
    {
        const blockTypes = Object.keys(this.blockPrefabPaths);

        for (const blockType of blockTypes) {
            const path = this.blockPrefabPaths[blockType];
            if (!path) {
                continue;
            }

            cc.resources.load(path, Prefab, (err: Error, prefab: cc.Prefab) => {
                if (err) {
                    console.error(`Failed to load ${blockType}:`, err);
                } else {
                    this.prefabs[blockType] = prefab;
                }
            });
        }

        // for (let i = 0; i < this.PoolSize; i++)
        // {
        //     this.blocksPool[i] = new Block();
        // }


    }

    public create(block: Block, parent: cc.Node, at: Vec2): cc.Node
    {
        const prefab = this.prefabs[block.type];
        if (prefab) {
            const blockInstance = cc.instantiate(prefab);
            blockInstance.getComponent(BlockPresenter).setData(block);
            blockInstance.parent = parent;
            blockInstance.setPosition(at.x, at.y)
            console.log("Block position: x: " + blockInstance.position.x + ", y: " + blockInstance.position.y + "\nBlock Type: " + block.type);
            return blockInstance;
        } else {
            console.warn(`Prefab not loaded for block type: ${block.type}`);
            return null;
        }
    }
}
