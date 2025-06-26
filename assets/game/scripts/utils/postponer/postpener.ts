import {PostponedSequence} from "./postponedSequence";

export namespace Postponer {
    const AutoRun = true;

    export function sequence(): PostponedSequence {
        return setUpSequence(new PostponedSequence());
    }

    export function wait(task: () => Promise<void>): PostponedSequence {
        const sequence = new PostponedSequence();
        sequence.wait(task);
        return setUpSequence(sequence);
    }

    export function doAction(action: () => void): PostponedSequence {
        const sequence = new PostponedSequence();
        sequence.do(action);
        return setUpSequence(sequence);
    }

    function delayOneFrame(): Promise<void> {
        return new Promise(resolve => {
            setTimeout(resolve, 0);
        });
    }

    async function run(sequence: PostponedSequence) {
        await delayOneFrame();
        await sequence.run();
    }

    function setUpSequence(sequence: PostponedSequence): PostponedSequence {
        if (AutoRun) {
            run(sequence).catch(console.warn);
        }
        return sequence;
    }
}

//Example
// Postponer.sequence()
//     .do(() => this.loadSplashScreen())
//     .wait(() => new Promise(resolve => setTimeout(resolve, Durations.LoadingScreen * 1000)))
//     .do(() => this.loadMain())
