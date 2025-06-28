import {Block, BlockState} from "../model/block";
import tween = cc.tween;
import SpriteFrame = cc.SpriteFrame;

const {ccclass, property} = cc._decorator;

@ccclass
export default class BlockPresenter extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property([SpriteFrame])
    spriteFrames: SpriteFrame[] = [];

    public inUse: boolean = false;

    public setData(model: Block) {
        this.icon.spriteFrame = this.spriteFrames[model.type]
        this.icon.node.scale = 1;
        model.state.subscribe((val) => this.onBlockStateChanged(val));
    }

    private onBlockStateChanged(state: BlockState)
    {
        switch(state) {
            case BlockState.None:
                break;
            case BlockState.Idle:
                break;
            case BlockState.Destroying:
                this.playDestroyAnim()
                break;
            case BlockState.Moving:
                this.playCollapseAnim()
                break;
            case BlockState.Spawning:
                this.playSpawningAnim()
                break;
            case BlockState.Clicked:
                this.playClickedAnim()
                break;
        }
    }

    private playDestroyAnim()
    {
        tween(this.icon.node)
            .to(0.5, {scale: 0}, {easing: 'bounceOut'})
            .start();
    }

    private playCollapseAnim()
    {
        // tween(this.icon.node)
        //     .to(0.5, {rotation: }, {easing: 'bounceOut'})
    }

    private playSpawningAnim()
    {
        tween(this.icon.node)
            .to(0.5, {scale: 1}, {easing: 'bounceIn'})
            .start();
    }

    private playClickedAnim()
    {
        cc.Tween.stopAllByTarget(this.icon.node)
        this.icon.node.scale = 1
        this.icon.node.position = new cc.Vec3(this.node.width * 0.5, - this.node.height* 0.5, 0);
        this.icon.node.angle = 0;

        const popUp = cc.tween()
            .to(0.1, { scale: 1.2 }, { easing: 'quadOut' });
        const popDown = cc.tween()
            .to(0.1, { scale: 1.0 }, { easing: 'quadIn' });

        const shake = cc.tween()
            .by(0.05, { x: -8 })
            .by(0.1, { x: 16 })
            .by(0.05, { x: -8 });

        const wiggle = cc.tween()
            .to(0.05, { angle: 10 })
            .to(0.05, { angle: -10 })
            .to(0.05, { angle: 0 });

        cc.tween(this.icon.node)
            .sequence(
                popUp,
                popDown,
                cc.tween()
                    .parallel(shake, wiggle)
            )
            .start();
    }
}
