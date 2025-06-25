import {GridState} from "./grid_state";
import {IEnterState} from "../../../../utils/state_machine/state_machine";
import {Postponer} from "../../../../utils/postponer/postpener";
import {Durations} from "../../../../durations";

export class CollapsingState implements GridState, IEnterState
{
    enter(): void
    {
        Postponer.sequence()
            .do(() => this.collapse())
            .wait(() =>
                new Promise(resolve =>
                    setTimeout(resolve, Durations.Collapsing * 3000)))
            .do(() => this.switchState());
    }


}