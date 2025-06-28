import {IService} from "../service_locator/service";

export interface IStateMachine<T> extends IService
{
    registerState(state: T): void;
    enter(key: string): void;
}

export interface IEnterState
{
    enter(): void;
}

export interface IExitState
{
    exit(): void;
}


export class StateMachine<T> implements IStateMachine<T>
{
    private readonly _states: Map<string, T>;
    protected _state: T;

    constructor(states: T[] = [])
    {
        this._states = new Map<string, T>();
        states.forEach(state => this.registerState(state));
    }

    public registerState(state: T): void
    {
        this._states.set(state.constructor.name, state);
    }

    public enter<TState extends T>(state: string): void
    {
        this.switch<TState>(state)

        if (this._state.enter !== undefined)
        {
            this._state.enter();
            console.log("State Machine: You entered in ", state);
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
            console.log("State Machine: You exited from", state);
        }

        this._state = next;
    }
}