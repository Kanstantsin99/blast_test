import tween = cc.tween;
import Color = cc.Color;
import {Durations} from "../../../durations";
import fadeTo = cc.fadeTo;

const {ccclass, property} = cc._decorator;

export interface ILoadingScreen
{
    appear(): Promise<void>;
    fade(): Promise<void>;
}

@ccclass
export default class LoadingScreen extends cc.Component implements ILoadingScreen
{
    private _isCancelled = false;

    @property(cc.Node)
    Logo: cc.Node = null;

    @property(cc.Node)
    ForegroundImage: cc.Node = null;

    protected onDestroy()
    {
        this._isCancelled = true;
    }

    protected start()
    {
        this.ForegroundImage.opacity = 0;
    }

    public async appear(): Promise<void>
    {
        this._isCancelled = false;
        this.LogoPulsationAnim();
        await this.fadeTo(1);
    }

    public async fade(): Promise<void>
    {
        this._isCancelled = false;
        await this.fadeTo(0);
    }

    private fadeTo(opacity: number): Promise<void>
    {
        return new Promise(resolve => {
            if (this._isCancelled)
            {
                resolve();
                return;
            }

            cc.tween(this.ForegroundImage)
                .to(2, {opacity: opacity * 255})
                .call(() =>
                {
                    if (this._isCancelled) return;
                    resolve();
                })
                .start()
        });
    }

    private LogoPulsationAnim()
    {
        this.Logo.scale = 1;
        console.log("Logo pulsation started")

        tween(this.Logo)
            .to(2, {scale: 1.2}, {easing: 'sineIn'})
            .to(2, {scale: 1,}, {easing: 'sineOut'})
            .union()
            .repeatForever()
            .start();
    }
}
