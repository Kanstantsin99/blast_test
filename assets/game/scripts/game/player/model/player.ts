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

    getLevel(): number;
    checkWin(): boolean;
    checkLoose(): boolean;
    reset(): void;
}

export class Player implements IPlayer
{
    private readonly _initScore: number;
    private _grid: IGrid;
    private _initMovesLeft: number;
    private _initGoal: number;
    private _level: number;

    public movesLeft: ReactiveProperty<Number>;
    public score: ReactiveProperty<Number>;
    public goal: ReactiveProperty<Number>;

    constructor(movesLeft: Number, score: Number, goal: Number)
    {
        this._initMovesLeft = movesLeft;
        this._initScore = score;
        this._initGoal = goal;
        this._level = 1;

        this.movesLeft = new ReactiveProperty(movesLeft);
        this.score = new ReactiveProperty(score);
        this.goal = new ReactiveProperty(goal);
        this._grid = ServiceLocator.get(IGrid);

        this._grid.state.subscribe(gridState => {this.onGridStateChanged(gridState);});
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

    public getLevel(): number
    {
        return this._level;
    }

    private countScore()
    {
        this.movesLeft.value = cc.math.clamp(this.movesLeft.value - 1, 0, this.movesLeft.value);
        let matchedBlocks = this._grid.getMatches().length;
        let blockValue = 100;
        this.score.value = cc.math.clamp(this.score.value + matchedBlocks * blockValue, 0, this.goal.value);
    }

    public checkWin()
    {
        if (this.score.value >= this.goal.value)
        {
            this.levelUp();
            return true;
        }
        return false;
    }

    public checkLoose(): boolean
    {
        return this.movesLeft.value < 1;
    }

    public reset(): void
    {
        this.movesLeft.value = this._initMovesLeft;
        this.goal.value = this._initGoal;
        this.score.value = this._initScore;
    }

    private levelUp()
    {
        this._level++;
        this._initMovesLeft += 2;
        this._initGoal += 1000;
    }
}
