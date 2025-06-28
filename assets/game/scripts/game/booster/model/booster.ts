import {IGameStateMachine} from "../../infrastructure/game_state_machine";
import {IPlayer} from "../../player/model/player";
import {ReactiveProperty} from "../../../utils/types/reactive_property";
import {ServiceLocator} from "../../../utils/service_locator/service_locator";

interface IBooster
{
    state: ReactiveProperty<BoosterState>;
}

export enum BoosterState
{
    None = 0,
    Active = 1,
    NonActive = 2,
    Clicked = 2
}

export class Booster implements IBooster
{
    private _count: number;

    public state: ReactiveProperty<BoosterState>;

    constructor(count: number)
    {
        this._count = count;

    }

    activate(): void
    {

    }


}

export class TeleportBooster extends Booster
{

}