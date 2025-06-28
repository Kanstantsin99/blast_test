import {CancellationToken} from "./cancelation_token";


export class TweenAnimation
{
    static fadeTo(node: cc.Node, opacity: number, duration: number, cancellation: CancellationToken): Promise<void>
    {
        return new Promise(resolve =>
        {
            if (cancellation.isCancelled)
            {
                resolve();
                return;
            }

            cc.tween(node)
                .to(duration, {opacity: opacity * 255})
                .call(() =>
                {
                    if (cancellation.isCancelled) return;
                    resolve();
                })
                .start();
        });
    }

    static scaleTo(node: cc.Node, scale: number, duration: number, cancellation: CancellationToken): Promise<void>
    {
        return new Promise(resolve =>
        {
            if (cancellation.isCancelled)
            {
                resolve();
                return;
            }

            let initScale: number = scale > 0 ? 0 : node.scale;

            cc.tween(node)
                .set({scale: initScale})
                .to(duration, {scale: scale}, {easing: 'cubicIn'})
                .call(() =>
                {
                    if (cancellation.isCancelled) return;
                    resolve();
                })
                .start();
        });
    }

    static pulsation(node: cc.Node, frequency: number, cancellation: CancellationToken): Promise<void>
    {
        return new Promise(resolve =>
        {
            if (cancellation.isCancelled)
            {
                cc.tween(node).stop();
                resolve();
                return;
            }

            cc.tween(node)
                .set({scale: 1})
                .to(frequency/4, {scale: 1.2}, {easing: 'sineIn'})
                .to(frequency/4, {scale: 1,}, {easing: 'sineOut'})
                .union()
                .repeatForever()
                .start();
        });
    }
}