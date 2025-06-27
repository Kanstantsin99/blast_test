import {ReactiveProperty} from "../../../utils/types/reactive_property";
import {IService} from "../../../utils/service_locator/i_service";
import {ServiceLocator} from "../../../utils/service_locator/service_locator";
import {GridState, IGrid} from "../../grid/model/grid";

export const IPlayer = Symbol("IPlayer");
export interface IPlayer extends IService
{
    movesLeft: ReactiveProperty<number>;
    score: ReactiveProperty<number>;
    goal: ReactiveProperty<number>;

    checkWin(): boolean;
    checkLoose(): boolean;
    reset(): void;
}

export class Player implements IPlayer
{
    private grid: IGrid;

    public movesLeft: ReactiveProperty<Number>;
    public score: ReactiveProperty<Number>;
    public goal: ReactiveProperty<Number>;

    constructor(movesLeft: Number, score: Number, goal: Number) {
        this.movesLeft = new ReactiveProperty(movesLeft);
        this.score = new ReactiveProperty(score);
        this.goal = new ReactiveProperty(goal);
        this.grid = ServiceLocator.get(IGrid);

        this.grid.state.subscribe(gridState => {this.onGridStateChanged(gridState);});
    }

    private onGridStateChanged(gridState: GridState): void
    {
        switch(gridState)
        {
            case GridState.None:
                break;
            case GridState.Matching:
                this.countScore();
                break;
        }
    }

    private countScore()
    {
        this.movesLeft.value = cc.math.clamp(this.movesLeft.value - 1, 0, this.movesLeft.value);
        let matchedBlocks = this.grid.getMatches().length;
        let blockValue = 100;
        this.score.value = cc.math.clamp(this.score.value + matchedBlocks * blockValue, 0, this.goal.value);
    }

    public checkWin()
    {
        return this.score.value >= this.goal.value;
    }

    public checkLoose(): boolean
    {
        return this.movesLeft.value < 1;
    }

    public reset(): void
    {
        this.movesLeft.value = 10;
        this.goal.value = 5000;
        this.score.value = 0;
    }
}
