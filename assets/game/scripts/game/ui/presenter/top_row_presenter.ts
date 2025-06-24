
import {Player} from "../../player/model/player";
import {ServiceLocator} from "../../../utils/service_locator/service_locator";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TopRowPresenter extends cc.Component {

    private movesLeft;
    private score;
    private goal;

    @property(cc.Label)
    movesLeftLabel: cc.Label = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;
    start ()
    {
        let player = ServiceLocator.get(Player);

        player.movesLeft.subscribe(movesLeft => {this.onMovesLeftChanged(movesLeft);});
        player.goal.subscribe(goal => {this.onGoalChanged(goal);});
        player.score.subscribe(score => {this.onScoreChanged(score)})
    }

    private onMovesLeftChanged(movesLeft: number): void
    {
        this.movesLeft = movesLeft;
        this.movesLeftLabel.string = movesLeft.toString();
    }

    private onScoreChanged(score: Number): void
    {
        this.score = score;
        this.scoreLabel.string = score.toString() + "/" + this.goal;
    }

    private onGoalChanged(goal: Number): void
    {
        this.goal = goal;
        this.scoreLabel.string += "/" + goal.toString();
    }
}
