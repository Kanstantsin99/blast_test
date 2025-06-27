import {GameState} from "./game_state";
import {IEnterState, IExitState} from "../../../utils/state_machine/state_machine";
import {IGrid} from "../../grid/model/grid";
import {IGameStateMachine} from "../game_state_machine";
import {ServiceLocator} from "../../../utils/service_locator/service_locator";
import {Postponer} from "../../../utils/postponer/postpener";
import {Durations} from "../../../durations";
import {CollapsingState} from "./collapsing_state";

export class MatchingState implements GameState, IEnterState
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
        console.log("You entered in MatchingState");
        Postponer.sequence()
            .do(() => this._grid.destroyMatches())
            .wait(() => new Promise(resolve => {setTimeout(resolve, Durations.Destroying * 1000)}))
            .do(() => this._gameStateMachine.enter<CollapsingState>("CollapsingState"));
    }
}