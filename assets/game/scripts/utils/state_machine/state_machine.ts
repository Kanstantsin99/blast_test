export interface IStateMachine<T> {
    registerState(key: string, state: T): void;
    enter(key: string): void;
}

export interface IEnterState {
    enter(): void;
}

export interface IExitState {
    exit(): void;
}


export class StateMachine<T> implements IStateMachine<T>
{
    private readonly _states: Map<string, T>;
    private _state: T;

    constructor(states: Array<T>)
    {
        this._states = new Map<string, T>();
        states.forEach(state => this.registerState(state));
    }

    public registerState(state: T): void {
        this._states.set(state.constructor.name, state);
    }

    public enter<TState extends T>(state: string): void {
        this.switch<TState>(state)

        if (this._state.enter !== undefined)
        {
            this._state.enter();
        }
    }

    private switch<TState extends T>(state: string)
    {
        const next: TState = this._states.get(state);
        if (!next) {
            throw new Error(`State "${state}" not registered`);
        }


        if (this._state && this._state.exit !== undefined)
        {
            this._state.exit();
        }

        this._state = next;
    }
}