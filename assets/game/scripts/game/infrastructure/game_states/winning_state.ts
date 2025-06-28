import {GameState} from "./game_state";
import {IEnterState} from "../../../utils/state_machine/state_machine";
import {IGrid} from "../../grid/model/grid";
import {ISceneLoader, SceneLoader} from "../scenes/scene_loader";
import {IGameStateMachine} from "../game_state_machine";
import {ServiceLocator} from "../../../utils/service_locator/service_locator";
import {Postponer} from "../../../utils/postponer/postpener";
import {IPlayer} from "../../player/model/player";


export class WinningState implements GameState, IEnterState
{
    private _grid: IGrid;
    private _player: IPlayer;
    private _loader: SceneLoader;
    private _gameStateMachine: IGameStateMachine;

    constructor()
    {
        this._grid = ServiceLocator.get(IGrid);
        this._loader = ServiceLocator.get(ISceneLoader);
        this._gameStateMachine = ServiceLocator.get(IGameStateMachine);
        this._player = ServiceLocator.get(IPlayer);
    }

    enter(): void
    {
        let goal = this._player.getGoal().toString();
        let nextLevel = (this._player.getLevel() + 1).toString()
        Postponer.sequence()
            .wait(() =>
            {
                return this._loader.popUp.show("Победа!!!", "Молодец, ты заработал...\n" + goal + " очков!!!" +
                    "\nПопробуй " + nextLevel + " уровень.");
            })
            .wait(() =>
            {
                return this._loader.popUp.hide();
            })
            .do(() => this._grid.destroy())
            .wait(() => this._loader.loadingScreen.appear())
            .do(() => this._player.levelUp())
            .do(() => this._player.reset())
            .do(() => this._gameStateMachine.destroyCount = 3)
            .wait(() => this._loader.loadingScreen.fade())
            .do(() => this._gameStateMachine.enter("CollapsingState"))
    }
}