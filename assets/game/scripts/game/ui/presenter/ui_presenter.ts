

import {ServiceLocator} from "../../../utils/service_locator/service_locator";
import {Grid, GridStates} from "../../grid/model/grid";
import PopUp from "./popup";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UIPresenter extends cc.Component
{
    private grid: Grid;
    private popUp: PopUp;

    @property(cc.Prefab)
    restartPopUpPrefab: cc.Prefab = null;

    @property(cc.Sprite)
    backgroundSprite: cc.Sprite = null;
    start ()
    {
        this.grid = ServiceLocator.get(Grid);
        let restartPopUpNode = cc.instantiate(this.restartPopUpPrefab);
        this.popUp = restartPopUpNode.getComponent(PopUp);
        this.popUp.hide();
        restartPopUpNode.parent = this.node;

        this.grid.gridState.subscribe((gridState) => this.onGridStateChanged(gridState));
    }

    private onGridStateChanged(state: GridStates): void
    {
        switch(state)
        {
            case GridStates.None:
                break;
            case GridStates.Idle:
                break;
            case GridStates.DestroyingMatches:
                break;
            case GridStates.Collapsing:
                break;
            case GridStates.Win:
                this.showWinPopUp();
                break;
            case GridStates.Loose:
                this.showLoosePopUp();
                break;
        }
    }

    private showWinPopUp()
    {
        this.popUp.setData("You Win!!!");
        this.popUp.button.node.on('click', (button: cc.Button) => {this.restart()})
        this.popUp.show();
    }

    private showLoosePopUp()
    {
        this.popUp.setData("You Loose :(");
        this.popUp.button.node.on('click', (button: cc.Button) => {this.restart()})
        this.popUp.show();
    }

    private restart()
    {
        this.popUp.button.node.off('click');
        this.popUp.hide();
        this.grid.restart();
    }
}
