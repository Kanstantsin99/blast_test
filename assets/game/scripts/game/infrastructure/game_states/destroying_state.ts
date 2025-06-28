import {IEnterState} from "../../../utils/state_machine/state_machine";
import {GameState} from "./game_state";
import {IGrid} from "../../grid/model/grid";
import {IGameStateMachine} from "../game_state_machine";
import {ServiceLocator} from "../../../utils/service_locator/service_locator";
import {Postponer} from "../../../utils/postponer/postpener";
import {CheckingState} from "./checking_state";
import {LoosingState} from "./loosing_state";
import {CollapsingState} from "./collapsing_state";
import {Durations} from "../../../durations";


export class DestroyingState implements GameState, IEnterState
{
    private _grid: IGrid;
    private _gameStateMachine: IGameStateMachine;
    private _nextState: string;

    constructor()
    {
        this._grid = ServiceLocator.get(IGrid);
        this._gameStateMachine = ServiceLocator.get(IGameStateMachine);
    }

    enter(): void
    {
        let prevStateName = this._gameStateMachine.getPreviousState().constructor.name;
        Postponer.sequence()
            .do(() =>
            {
                if (prevStateName === "CheckingState")
                {
                    this._gameStateMachine.destroyCount--;
                    if (this._gameStateMachine.destroyCount <= 0)
                    {
                        this._nextState = "LoosingState";
                        return
                    }
                    this._grid.destroy();
                    this._nextState = "CollapsingState";
                }
                else
                {
                    this._grid.destroy();
                    this._nextState = "CollapsingState";
                }
            })
            .wait(() => new Promise(resolve => {setTimeout(resolve, Durations.Destroying * 1000)}))
            .do(() => {this._gameStateMachine.enter(this._nextState)})
    }
}