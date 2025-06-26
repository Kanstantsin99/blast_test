import {IEnterState} from "../../../utils/state_machine/state_machine";
import {GameState} from "./game_state";

export class CollapsingState implements GameState, IEnterState
{
    enter(): void
    {
        console.log("You entered CollapsingState");
    }
}