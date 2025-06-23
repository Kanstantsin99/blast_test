import {Grid} from "../grid/model/grid";
import Vec2 = cc.Vec2;
import {ServiceLocator} from "../../utils/service_locator/service_locator";
import {BlockFactory} from "../grid/model/block_factory";
import { Postponer } from "../../utils/postponer/postpener";
import {Player} from "../../player/model/player";


const {ccclass, property} = cc._decorator;


@ccclass
export default class StartApplication extends cc.Component
{
    @property(cc.Prefab)
    splashScreen: cc.Prefab = null;

    @property(cc.Prefab)
    mainScene: cc.Prefab = null;

    private readonly gridSize: Vec2 = new Vec2(9,9);

    protected onLoad()
    {
        this.bindBlockFactory();
        this.bindGrid();
        this.bindPlayer();

        this.launchGameLoop();
    }


    private launchGameLoop() {
        Postponer.sequence()
            .do(() => this.loadSlashScreen())
            .wait(() => new Promise(resolve => setTimeout(resolve, 1000)))
            .do(() => this.loadMain())
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

    private loadSlashScreen() {
        const splashScreenNode = cc.instantiate(this.splashScreen);
        this.node.addChild(splashScreenNode);
        console.log("Splash screen loaded");
    }

    private bindGrid() {
        const gridService = new Grid()
        gridService.setData(this.gridSize)
        ServiceLocator.register(Grid, gridService);
    }
}
