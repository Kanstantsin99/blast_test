import {IEnterState, IExitState} from "../../../utils/state_machine/state_machine";
import {GameState} from "./game_state";

export class DestroyingState implements GameState, IEnterState, IExitState
{
    enter(): void {
        console.log("You entered in Destroying State");
    }

    exit(): void {
        console.log("You exited from Destroying State");
    }
}