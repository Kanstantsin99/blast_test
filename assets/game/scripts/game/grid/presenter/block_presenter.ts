import {Block, BlockState} from "../model/block";
import tween = cc.tween;

const {ccclass, property} = cc._decorator;

@ccclass
export default class BlockPresenter extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    start () {
    }

    public setData(model: Block) {
        model.state.on('changed', (val) => this.onBlockStateChanged(val));
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
            case BlockState.Collapsing:
                this.playCollapseAnim()
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
        //     .to(0.5, {position: }, {easing: 'bounceOut'})
    }
}
