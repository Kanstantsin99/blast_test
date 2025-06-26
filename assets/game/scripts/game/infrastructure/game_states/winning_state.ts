import {GameState} from "./game_state";
import {IEnterState, IExitState} from "../../../utils/state_machine/state_machine";

export class WinningState implements GameState, IEnterState, IExitState
{
    enter(): void {
        console.log("You entered in Winning State");
    }

    exit(): void {
        console.log("You exited from Winning State");
    }

}