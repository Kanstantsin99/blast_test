import {GameStateMachine, IGameStateMachine} from "./game_state_machine";
import {GameState} from "./game_states/game_state";
import {IPlayer, Player} from "../player/model/player";
import {ServiceLocator} from "../../utils/service_locator/service_locator";
import {BlockFactory} from "../grid/model/block_factory";
import {SceneLoader, ISceneLoader} from "./scenes/scene_loader";
import {GreetingState} from "./game_states/greetings_state";
import {CollapsingState} from "./game_states/collapsing_state";
import {CheckingState} from "./game_states/checking_state";
import {IdleState} from "./game_states/idle_state";
import {DestroyingState} from "./game_states/destroying_state";
import {WinningState} from "./game_states/winning_state";
import {LoosingState} from "./game_states/loosing_state";
import {Grid, IGrid} from "../grid/model/grid";
import {Postponer} from "../../utils/postponer/postpener";
import {BootingState} from "./game_states/booting_state";
import {Durations} from "../../durations";
import {MatchingState} from "./game_states/matching_state";
import Vec2 = cc.Vec2;


const {ccclass} = cc._decorator;

@ccclass
export default class StartApplication extends cc.Component
{
    private readonly _gridSize: Vec2 = new Vec2(5,5);
    private _gameStateMachine: IGameStateMachine;

    protected onLoad()
    {
        this.launchServices();
        this.launchGame();
    }

    private launchServices()
    {
        this.bindSceneLoader();
        this.bindBlockFactory();
        this.bindGrid();
        this.bindPlayer();
        this.bindGameStateMachine();
    }

    private launchGame()
    {
        Postponer.sequence()
            .wait(() => new Promise(resolve => setTimeout(resolve, Durations.LoadingScreen * 1000)))
            .do(() => this._gameStateMachine.enter<BootingState>("BootingState"));
    }

    private bindPlayer()
    {
        const player: IPlayer = new Player(4, 0, 1000);
        ServiceLocator.register(IPlayer, player);
    }

    private bindBlockFactory()
    {
        const blockFactory = new BlockFactory(this._gridSize);
        blockFactory.load()
        ServiceLocator.register(BlockFactory, blockFactory)
    }

    private bindGameStateMachine()
    {
        this._gameStateMachine = new GameStateMachine();
        ServiceLocator.register(IGameStateMachine, this._gameStateMachine);
        this.initGameStateMachine();
    }

    private bindSceneLoader()
    {
        const sceneLoader: ISceneLoader = new SceneLoader();
        ServiceLocator.register(ISceneLoader, sceneLoader);
    }

    private bindGrid()
    {
        const gridService: IGrid = new Grid(this._gridSize);
        ServiceLocator.register(IGrid, gridService);
    }

    private initGameStateMachine()
    {
        const states: GameState[] =
            [new BootingState, new GreetingState, new CollapsingState, new CheckingState,
                new IdleState, new MatchingState, new DestroyingState, new WinningState, new LoosingState];
        states.forEach(state =>
            {
                this._gameStateMachine.registerState(state);
            }
        );
    }
}