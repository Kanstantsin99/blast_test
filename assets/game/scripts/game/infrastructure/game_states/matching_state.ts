import {GameState} from "./game_state";
import {IEnterState, IExitState} from "../../../utils/state_machine/state_machine";

export class MatchingState implements GameState, IEnterState, IExitState
{
    enter(): void {
        console.log("You entered in MatchingState");
    }

    exit(): void {
        console.log("You exited from MatchingState");
    }

}