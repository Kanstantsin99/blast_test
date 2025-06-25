import {GridState} from "./grid_state";
import {IEnterState, IExitState} from "../../../../utils/state_machine/state_machine";

export class CheckingState implements GridState, IEnterState, IExitState
{
    enter(): void {
        console.log("You entered in Checking State");
    }

    exit(): void {
        console.log("You exited from Checking State");
    }

}