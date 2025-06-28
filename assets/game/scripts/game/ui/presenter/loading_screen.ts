import {TweenAnimation} from "../model/tween_animations";
import {Durations} from "../../../durations";
import {CancellationToken} from "../model/cancelation_token";

const {ccclass, property} = cc._decorator;


export interface ILoadingScreen
{
    appear(): Promise<void>;
    fade(): Promise<void>;
}

@ccclass
export default class LoadingScreen extends cc.Component implements ILoadingScreen
{
    private _cancellationToken: CancellationToken;

    @property(cc.Node)
    Logo: cc.Node = null;

    @property(cc.Node)
    ForegroundImage: cc.Node = null;

    protected onDestroy()
    {
        this._cancellationToken.cancel();
    }

    protected start()
    {
        this._cancellationToken = new CancellationToken();
        this.ForegroundImage.opacity = 0;
    }

    public async appear(): Promise<void>
    {
        this._cancellationToken = new CancellationToken();
        TweenAnimation.pulsation(this.Logo, 2, this._cancellationToken);
        await TweenAnimation.fadeTo(this.node, 1, Durations.LoadingScreen, this._cancellationToken);
    }

    public async fade(): Promise<void>
    {
        await TweenAnimation.fadeTo(this.node, 0, Durations.LoadingScreen, this._cancellationToken);
        this._cancellationToken.cancel();
    }
}
