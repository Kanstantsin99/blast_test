export class ReactiveProperty extends cc.EventTarget
{
    private _value: number = 0;

    set value(val: number) {
        this._value = val;
        this.emit('changed', val);
    }

    get value(): number {
        return this._value;
    }
}