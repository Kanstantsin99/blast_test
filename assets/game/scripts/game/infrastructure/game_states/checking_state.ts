import {IEnterState} from "../../../utils/state_machine/state_machine";
import {GameState} from "./game_state";
import {Postponer} from "../../../utils/postponer/postpener";
import {IGrid} from "../../grid/model/grid";
import {IGameStateMachine} from "../game_state_machine";
import {ServiceLocator} from "../../../utils/service_locator/service_locator";
import {DestroyingState} from "./destroying_state";
import {IdleState} from "./idle_state";
import {IPlayer} from "../../player/model/player";


export class CheckingState implements GameState, IEnterState
{
    private _grid: IGrid;
    private _player: IPlayer;
    private _gameStateMachine: IGameStateMachine;
    private _needToShuffle: boolean = false;
    private _nextState: string;

    constructor()
    {
        this._grid = ServiceLocator.get(IGrid);
        this._gameStateMachine = ServiceLocator.get(IGameStateMachine);
        this._player = ServiceLocator.get(IPlayer);
    }

    enter(): void {
        Postponer.sequence()
            .do(() => {this._needToShuffle = this._grid.prepare()})
            .do(() => {this._grid.savePositions()})
            .do(() => {this._nextState = "IdleState";})
            .do(() => {if(this._needToShuffle) this._nextState = "DestroyingState";})
            .do(() => {if(this._player.checkLoose()) this._nextState = "LoosingState";})
            .do(() => {if(this._player.checkWin()) this._nextState = "WinningState";})
            .do(() => {this._gameStateMachine.enter(this._nextState)});
    }
}