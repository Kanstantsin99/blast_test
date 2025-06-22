import tween = cc.tween;
import Color = cc.Color;

const {ccclass, property} = cc._decorator;

@ccclass
export default class SplashScreen extends cc.Component {

    @property(cc.Node)
    Logo: cc.Node = null;

    @property(cc.Node)
    ForegroundImage: cc.Node = null;

    start () {
        this.FadeOutAnim();
        this.LogoPulsationAnim();
        console.log("StartApplication started");

    }

    private LogoPulsationAnim() {
        this.Logo.scale = 1;

        tween(this.Logo)
            .to(2, {scale: 1.2}, {easing: 'sineIn'})
            .to(2, {scale: 1,}, {easing: 'sineOut'})
            .union()
            .repeatForever()
            .start();
    }

    private FadeOutAnim() {
        this.ForegroundImage.opacity = 255;

        tween(this.ForegroundImage)
            .to(1, {color: Color.BLACK, opacity: 0}, {easing: 'linear'})
            .start();
    }
}
