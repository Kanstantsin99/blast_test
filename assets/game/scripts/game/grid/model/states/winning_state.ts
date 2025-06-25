import {GridState} from "./grid_state";
import {IEnterState, IExitState} from "../../../../utils/state_machine/state_machine";

export class WinningState implements GridState, IEnterState, IExitState
{
    enter(): void {
        console.log("You entered in Winning State");
    }

    exit(): void {
        console.log("You exited from Winning State");
    }

}