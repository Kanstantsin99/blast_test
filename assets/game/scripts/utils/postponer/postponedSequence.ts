export class PostponedSequence {
    private steps: (() => Promise<void>)[] = [];

    public wait(task: () => Promise<void>) {
        this.steps.push(task);
        return this;
    }

    public do(action: () => void) {
        this.steps.push(() => {
            action();
            return Promise.resolve();
        });
        return this;
    }

    public async run() {
        for (const step of this.steps) {
            await step();
        }
    }
}