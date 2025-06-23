import {ServiceLocator} from "../../utils/service_locator/service_locator";
import {Grid, GridState} from "../../game/grid/model/grid";
import RestartPopup from "./restart_popup";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIPresenter extends cc.Component
{
    private grid: Grid;
    private restartPopUp: RestartPopup;

    @property(cc.Prefab)
    restartPopUpPrefab: cc.Prefab = null;

    start ()
    {
        this.grid = ServiceLocator.get(Grid);
        let restartPopUpNode = cc.instantiate(this.restartPopUpPrefab);
        this.restartPopUp = restartPopUpNode.getComponent(RestartPopup);
        this.restartPopUp.hide();
        restartPopUpNode.parent = this.node;

        this.grid.gridState.subscribe((gridState) => this.onGridStateChanged(gridState));
    }

    private onGridStateChanged(state: GridState): void
    {
        switch(state)
        {
            case GridState.None:
                break;
            case GridState.Idle:
                break;
            case GridState.DestroyingMatches:
                break;
            case GridState.Collapsing:
                break;
            case GridState.Win:
                this.showWinPopUp();
                break;
            case GridState.Loose:
                this.showLoosePopUp();
                break;
        }
    }

    private showWinPopUp()
    {
        this.restartPopUp.setData("You Win!!!");
        this.restartPopUp.button.node.on('click', (button: cc.Button) => {this.restart()})
        this.restartPopUp.show();
    }

    private showLoosePopUp()
    {
        this.restartPopUp.setData("You Loose :(");
        this.restartPopUp.button.node.on('click', (button: cc.Button) => {this.restart()})
        this.restartPopUp.show();
    }

    private restart()
    {
        this.restartPopUp.button.node.off('click');
        this.restartPopUp.hide();
        this.grid.restart();
    }
}
