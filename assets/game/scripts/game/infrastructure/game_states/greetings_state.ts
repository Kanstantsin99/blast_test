import {GameState} from "./game_state";
import {IEnterState, IExitState} from "../../../utils/state_machine/state_machine";
import {Postponer} from "../../../utils/postponer/postpener";
import {IGameStateMachine} from "../game_state_machine";
import {ServiceLocator} from "../../../utils/service_locator/service_locator";
import {SceneLoader} from "../scenes/scene_loader";
import {CollapsingState} from "./collapsing_state";


export class GreetingState implements GameState, IEnterState, IExitState
{
    private readonly _gameStateMachine: IGameStateMachine;
    private readonly _loader: SceneLoader;

    constructor()
    {
        this._gameStateMachine = ServiceLocator.get(IGameStateMachine);
        this._loader = ServiceLocator.get(SceneLoader);
    }
    enter(): void
    {
        console.log("You entered in GreetingState");
        Postponer.sequence()
            .wait(() => {return this._loader.popUp.show("Welcome")})
            .do(() => {console.log("Root children:", cc.director.getScene().children);})
            .wait(() => {return this._loader.popUp.hide()})
            .do(() => {this._gameStateMachine.enter<CollapsingState>("CollapsingState")})
    }

    exit(): void
    {
        console.log("You exited from GreetingState");
    }

}