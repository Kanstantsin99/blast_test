import {GameState} from "./game_state";
import {IEnterState} from "../../../utils/state_machine/state_machine";
import {GridState, IGrid} from "../../grid/model/grid";
import {IGameStateMachine} from "../game_state_machine";
import {ServiceLocator} from "../../../utils/service_locator/service_locator";
import {Postponer} from "../../../utils/postponer/postpener";
import {MatchingState} from "./matching_state";

export class IdleState implements GameState, IEnterState
{
    private _grid: IGrid;
    private _gameStateMachine: IGameStateMachine;

    constructor()
    {
        this._grid = ServiceLocator.get(IGrid);
        this._gameStateMachine = ServiceLocator.get(IGameStateMachine);
    }

    enter(): void {
        Postponer.sequence()
            .do(() => this._grid.state.value = GridState.WaitingInput)
            .wait(() => new Promise(resolve => this._grid.state.subscribe(() => {if (this._grid.state.value === GridState.Matching) resolve();})))
            .do(() => this._gameStateMachine.enter<MatchingState>("MatchingState"));
    }
}