import {GridState} from "./grid_state";
import {IEnterState, IExitState} from "../../../../utils/state_machine/state_machine";

export class MatchingState implements GridState, IEnterState, IExitState
{
    enter(): void {
        console.log("You entered in MatchingState");
    }

    exit(): void {
        console.log("You exited from MatchingState");
    }

}