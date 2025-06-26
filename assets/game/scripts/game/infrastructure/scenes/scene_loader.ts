import {IService} from "../../../utils/service_locator/i_service";
import LoadingScreen, {ILoadingScreen} from "../../ui/presenter/loading_screen";
import PopUp, {IPopUp} from "../../ui/presenter/popup";

interface ISceneLoader extends IService
{
    popUp: IPopUp;
    loadingScreen: ILoadingScreen;
    load(scene: string): Promise<void>;
}

export class SceneLoader implements ISceneLoader
{
    private readonly LoadingScenePrefabPath = "/prefabs/ui/loading_screen";
    private readonly PopUpPrefabPath = "/prefabs/ui/pop_up";
    private _main: cc.Node;
    private _persistent: cc.Node;
    public popUp: IPopUp;
    public loadingScreen: ILoadingScreen;

    constructor()
    {
        this._main = cc.find("Canvas/Main");
        this._persistent = cc.find("Canvas/Persistent");
        this.loadingScreen = cc.find("Canvas/Persistent/LoadingScreen").getComponent(LoadingScreen);
        this.popUp = cc.find("Canvas/Persistent/PopUp").getComponent(PopUp);
    }

    public async load (scene: string): Promise<void>
    {
        await this.loadToMain(scene);
    }

    private loadToPersistent<T>(path: string, property: T, type: T)
    {
        cc.resources.load<cc.Prefab>(path, cc.Prefab, (err: Error, prefab:cc.Prefab) => {
            const node = cc.instantiate(prefab);
            property = node.getComponent(type);
            this._persistent.addChild(node);
        })
    }

    private loadToMain(scene: string): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            cc.resources.load<cc.Prefab>(scene, cc.Prefab, (err: Error, prefab:cc.Prefab) => {
                const node = cc.instantiate(prefab);
                this._main.addChild(node);
                resolve();
            })
        })
    }

}