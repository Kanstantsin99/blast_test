import {GridState} from "./grid_state";
import {IEnterState, IExitState} from "../../../../utils/state_machine/state_machine";

export class IdleState implements GridState, IEnterState, IExitState
{
    enter(): void {
        console.log("You entered in IdleState");
    }

    exit(): void {
        console.log("You exited from IdleState");
    }

}