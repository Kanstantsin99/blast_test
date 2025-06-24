const {ccclass, property} = cc._decorator;

@ccclass
export default class PopUp extends cc.Component
{
    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Button)
    button: cc.Button = null;

    @property(cc.Node)
    visuals: cc.Node = null;

    start()
    {
        this.visuals.active = false;
    }

    public setData(string: string)
    {
        this.label.string = string;
    }

    public show()
    {
        this.visuals.active = true;
    }

    public hide()
    {
        this.visuals.active = false;
    }
}
