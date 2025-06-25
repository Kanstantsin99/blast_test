import {Grid} from "../grid/model/grid";
import {ServiceLocator} from "../../utils/service_locator/service_locator";
import {BlockFactory} from "../grid/model/block_factory";
import {Postponer} from "../../utils/postponer/postpener";
import {Player} from "../player/model/player";
import {Durations} from "../../durations";
import {StateMachine} from "../../utils/state_machine/state_machine";
import {GridState} from "../grid/model/states/grid_state";
import {IdleState} from "../grid/model/states/idle_state";
import {CollapsingState} from "../grid/model/states/collapsing_state";
import {GreetingState} from "../grid/model/states/greetings_state";
import {CheckingState} from "../grid/model/states/checking_state";
import {DestroyingState} from "../grid/model/states/destroying_state";
import {WinningState} from "../grid/model/states/winning_state";
import {LoosingState} from "../grid/model/states/loosing_state";
import Vec2 = cc.Vec2;


const {ccclass, property} = cc._decorator;


@ccclass
export default class StartApplication extends cc.Component
{
    @property(cc.Prefab)
    splashScreen: cc.Prefab = null;

    @property(cc.Prefab)
    mainScene: cc.Prefab = null;

    private readonly gridSize: Vec2 = new Vec2(3,3);

    protected onLoad()
    {
        this.bindBlockFactory();
        this.bindGrid();
        this.bindPlayer();

        this.launchGameGame();
    }

    private bindPlayer() {
        const player = new Player(10, 0, 5000);
        ServiceLocator.register(Player, player);
    }

    private bindBlockFactory() {
        const blockFactory = new BlockFactory(this.gridSize);
        blockFactory.load()
        ServiceLocator.register(BlockFactory, blockFactory)
    }

    private loadMain() {
        const mainScene = cc.instantiate(this.mainScene);
        this.node.addChild(mainScene);
        console.log("Main scene loaded");
    }

    private loadSplashScreen() {
        const splashScreenNode = cc.instantiate(this.splashScreen);
        this.node.addChild(splashScreenNode);
        console.log("Splash screen loaded");
    }

    private bindGrid() {
        // Init grid state machine
        const states: GridState[] =
            [new GreetingState, new CollapsingState, new CheckingState,
            new IdleState, new DestroyingState, new WinningState, new LoosingState];
        const gridStateMachine = new StateMachine<GridState>(states);
        // init grid
        const gridService = new Grid(this.gridSize, gridStateMachine);
        ServiceLocator.register(Grid, gridService);
    }

    private launchGameGame() {
        Postponer.sequence()
            .do(() => this.loadSplashScreen())
            .wait(() => new Promise(resolve => setTimeout(resolve, Durations.LoadingScreen * 1000)))
            .do(() => this.loadMain())
    }

    private onStartGame()
    {
        // switch to greeting state
    }

    private onWelcomePopUpClicked()
    {
        // switch to collapsing
    }
}
