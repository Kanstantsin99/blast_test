import {IStateMachine, StateMachine} from "../../utils/state_machine/state_machine";
import {GameState} from "./game_states/game_state";


export const IGameStateMachine = Symbol("IGameStateMachine");

export interface IGameStateMachine extends IStateMachine<GameState>
{
    destroyCount: number;
    getState(): GameState;
    getPreviousState(): GameState;
}

export class GameStateMachine extends StateMachine<GameState> implements IGameStateMachine
{
    private _prevState: GameState;
    public destroyCount: number = 3;

    getState(): GameState
    {
        return this._state;
    }

    getPreviousState(): GameState
    {
        return this._prevState;
    }

    enter<TState extends GameState>(state: string) {
        this._prevState = this._state;
        super.enter(state);
    }
}
