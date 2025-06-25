import {GridState} from "./grid_state";
import {IEnterState, IExitState} from "../../../../utils/state_machine/state_machine";

export class DestroyingState implements GridState, IEnterState, IExitState
{
    enter(): void {
        console.log("You entered in Destroying State");
    }

    exit(): void {
        console.log("You exited from Destroying State");
    }

}