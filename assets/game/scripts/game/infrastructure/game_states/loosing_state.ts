import {GameState} from "./game_state";
import {IEnterState, IExitState} from "../../../utils/state_machine/state_machine";
import {IGrid} from "../../grid/model/grid";
import {IGameStateMachine} from "../game_state_machine";
import {ServiceLocator} from "../../../utils/service_locator/service_locator";
import {Postponer} from "../../../utils/postponer/postpener";
import {ISceneLoader, SceneLoader} from "../scenes/scene_loader";
import {DestroyingState} from "./destroying_state";
import {IPlayer} from "../../player/model/player";

export class LoosingState implements GameState, IEnterState
{
    private _grid: IGrid;
    private _loader: SceneLoader;
    private _gameStateMachine: IGameStateMachine;
    private _player: IPlayer;

    constructor()
    {
        this._grid = ServiceLocator.get(IGrid);
        this._loader = ServiceLocator.get(ISceneLoader);
        this._gameStateMachine = ServiceLocator.get(IGameStateMachine);
        this._player = ServiceLocator.get(IPlayer);
    }


    enter(): void
    {
        console.log("You entered in LoosingState");
        Postponer.sequence()
            .wait(() =>
            {
                return this._loader.popUp.show("Видимо, тебе не повезло :(\nПопробуй еще раз!");
            })
            .wait(() =>
            {
                return this._loader.popUp.hide();
            })
            .do(() => this._gameStateMachine.destroyCount = 3)
            .do(() => this._player.reset())
            .do(() => this._gameStateMachine.enter<DestroyingState>("DestroyingState"));
    }
}