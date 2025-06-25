import {ReactiveProperty} from "../../../utils/types/reactive_property";
import {Grid, GridStates} from "../../grid/model/grid";
import {IService} from "../../../utils/service_locator/i_service";
import {ServiceLocator} from "../../../utils/service_locator/service_locator";


export class Player implements IService
{
    private grid: Grid;

    public movesLeft: ReactiveProperty<Number>;
    public score: ReactiveProperty<Number>;
    public goal: ReactiveProperty<Number>;

    constructor(movesLeft: Number, score: Number, goal: Number) {
        this.movesLeft = new ReactiveProperty(movesLeft);
        this.score = new ReactiveProperty(score);
        this.goal = new ReactiveProperty(goal);
        this.grid = ServiceLocator.get(Grid);

        this.grid.gridState.subscribe(gridState => {this.onGridStateChanged(gridState);});
    }

    private onGridStateChanged(gridState: GridStates): void
    {
        switch(gridState)
        {
            case GridStates.None:
                break;
            case GridStates.Idle:
                break;
            case GridStates.DestroyingMatches:
                this.countScore();
                break;
            case GridStates.Collapsing:
                this.checkWinLoose();
                break;
        }
    }

    private countScore()
    {
        if(!this.grid.matches)
        {
            return;
        }
        this.movesLeft.value = cc.math.clamp(this.movesLeft.value - 1, 0, this.movesLeft.value);
        let matchedBlocks = this.grid.matches.length;
        let blockValue = 100;
        this.score.value = cc.math.clamp(this.score.value + matchedBlocks * blockValue, 0, this.goal.value);
    }

    private checkWinLoose()
    {
        if (this.score.value >= this.goal.value)
        {
            this.grid.gridState.value = GridStates.Win;
            return;
        }

        if (this.movesLeft.value < 1)
        {
            this.grid.gridState.value = GridStates.Loose;
            return;
        }
    }
}
