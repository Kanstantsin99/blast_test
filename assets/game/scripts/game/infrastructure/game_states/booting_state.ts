import {GameState} from "./game_state";
import {IEnterState} from "../../../utils/state_machine/state_machine";
import {Postponer} from "../../../utils/postponer/postpener";
import {IGameStateMachine} from "../game_state_machine";
import {ServiceLocator} from "../../../utils/service_locator/service_locator";
import {ISceneLoader} from "../scenes/scene_loader";
import {GreetingState} from "./greetings_state";


export class BootingState implements GameState, IEnterState
{
    private readonly _gameStateMachine: IGameStateMachine;
    private readonly _loader: ISceneLoader;

    constructor()
    {
        this._gameStateMachine = ServiceLocator.get(IGameStateMachine);
        this._loader = ServiceLocator.get(ISceneLoader);
    }

    enter(): void
    {
        Postponer.sequence()
            .wait(() => {return this._loader.loadingScreen.appear()})
            .wait(() => {return this._loader.load("prefabs/ui/ui")})
            .wait(() => {return this._loader.loadingScreen.fade()})
            .do(() => this._gameStateMachine.enter<GreetingState>("GreetingState"));
    }
}