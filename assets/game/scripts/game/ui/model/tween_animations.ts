import {CancellationToken} from "./cancelation_token";


export class TweenAnimation
{
    static fadeTo(node: cc.Node, opacity: number, cancellation: CancellationToken): Promise<void>
    {
        return new Promise(resolve =>
        {
            if (cancellation.isCancelled)
            {
                resolve();
                return;
            }

            cc.tween(node)
                .to(2, {opacity: opacity * 255})
                .call(() =>
                {
                    if (cancellation.isCancelled) return;
                    resolve();
                })
                .start();
        });
    }
}