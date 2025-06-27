
import {CancellationToken} from "../model/cancelation_token";
import {TweenAnimation} from "../model/tween_animations";
import {Durations} from "../../../durations";

const {ccclass, property} = cc._decorator


export interface IPopUp
{
    show(text: string): Promise<void>;
    hide(): Promise<void>;
}

@ccclass
export default class PopUp extends cc.Component implements IPopUp
{
    private _isCancelled: CancellationToken = new CancellationToken();

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Button)
    button: cc.Button = null;

    @property(cc.Node)
    visuals: cc.Node = null;

    protected onDestroy()
    {
        this._isCancelled.cancel();
    }

    start()
    {
        this.visuals.opacity = 0;
    }

    public async show(text: string): Promise<void>
    {
        this.setData(text);
        this._isCancelled = new CancellationToken();
        TweenAnimation.fadeTo(this.visuals, 1, Durations.PopUp, this._isCancelled)
        TweenAnimation.scaleTo(this.visuals, 1, Durations.PopUp, this._isCancelled)
        await this.buttonClick();
    }

    public async hide(): Promise<void>
    {
        TweenAnimation.fadeTo(this.visuals, 0, Durations.PopUp, this._isCancelled);
        await TweenAnimation.scaleTo(this.visuals, 0, Durations.PopUp, this._isCancelled);
    }

    private setData(string: string)
    {
        this.label.string = string;
    }

    private buttonClick(): Promise<void>
    {
        return new Promise(resolve =>
        {
            this.button.node.on('click', () => resolve());
        })
    }
}
