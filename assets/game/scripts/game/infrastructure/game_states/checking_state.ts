import {IEnterState, IExitState} from "../../../utils/state_machine/state_machine";
import {GameState} from "./game_state";

export class CheckingState implements GameState, IEnterState, IExitState
{
    enter(): void {
        console.log("You entered in Checking State");
    }

    exit(): void {
        console.log("You exited from Checking State");
    }

}