import {IService} from "../../utils/service_locator/i_service";
import {IStateMachine, StateMachine} from "../../utils/state_machine/state_machine";
import {GameState} from "./game_states/game_state";


export class IGameStateMachine extends StateMachine<GameState>
{

}

export class GameStateMachine<GameState> extends StateMachine<GameState> implements IGameStateMachine
{

}
