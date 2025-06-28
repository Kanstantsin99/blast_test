import {GameState} from "./game_state";
import {IEnterState} from "../../../utils/state_machine/state_machine";
import {Postponer} from "../../../utils/postponer/postpener";
import {IGameStateMachine} from "../game_state_machine";
import {ServiceLocator} from "../../../utils/service_locator/service_locator";
import {ISceneLoader} from "../scenes/scene_loader";
import {CollapsingState} from "./collapsing_state";


export class GreetingState implements GameState, IEnterState
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
            .wait(() => {return this._loader.popUp.show("Привет!",
                "У меня для тебя есть просьба. Потыкай в места, где больше всего блоков одного цвета." +
                "\nСверху ты найдешь кол-во оставшихся ходов и очков." +
                "\n1 блок = 100 очков." +
                "\nВремя действовать!")})
            .wait(() => {return this._loader.popUp.hide()})
            .do(() => {this._gameStateMachine.enter<CollapsingState>("CollapsingState")})
    }
}