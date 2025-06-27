import {IEnterState} from "../../../utils/state_machine/state_machine";
import {GameState} from "./game_state";
import {IGrid} from "../../grid/model/grid";
import {ServiceLocator} from "../../../utils/service_locator/service_locator";
import {Postponer} from "../../../utils/postponer/postpener";
import {IGameStateMachine} from "../game_state_machine";
import {CheckingState} from "./checking_state";
import {Durations} from "../../../durations";

export class CollapsingState implements GameState, IEnterState
{
    private _grid: IGrid;
    private _gameStateMachine: IGameStateMachine;

    constructor()
    {
        this._grid = ServiceLocator.get(IGrid);
        this._gameStateMachine = ServiceLocator.get(IGameStateMachine);
    }

    enter(): void
    {
        console.log("You entered CollapsingState");
        Postponer.sequence()
            .do(() => this._grid.collapse())
            .wait(() => new Promise(resolve => setTimeout(resolve, Durations.Collapsing * 1000)))
            .do(() => this._gameStateMachine.enter("CheckingState"));
    }
}