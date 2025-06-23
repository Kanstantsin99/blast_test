export class ReactiveProperty<T>
{
    private _value: T;
    private _bus = new cc.EventTarget();

    constructor(initialValue: T) {
        this._value = initialValue;
    }

    get value(): T {
        return this._value;
    }

    set value(val: T) {
        this._value = val;
        this._bus.emit('changed', val);
    }

    public subscribe(onChange: (val: T) => void, thisArg?: any) {
        // 1) fire once right now…
        onChange.call(thisArg, this._value);
        // 2) then listen for future updates
        this._bus.on('changed', onChange, thisArg);
    }

    public unsubscribe(onChange: (val: T) => void, thisArg?: any) {
        this._bus.off('changed', onChange, thisArg);
    }
}