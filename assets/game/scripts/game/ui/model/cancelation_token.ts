export class CancellationToken
{
    private _isCancelled = false;
    public cancel() { this._isCancelled = true; }
    public get isCancelled() { return this._isCancelled; }
}