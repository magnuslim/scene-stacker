const assert = require('assert');
const StepDescriber = require('../step/describer');
const StepExecuter = require('../step/executer');

module.exports = class {
    constructor(desc) {
        this.executer = StepExecuter.create();
        this.desc = desc;
        this._subScenes = [];
        this._allSteps = [];
        this._completedSteps = [];
    }

    get timeout() {
        return this._allSteps.map(step => step.timeout).reduce((total, current) => total + current, 0);
    }

    get subScenesTimeout() {
        let allSteps = this._subScenes.map(scene => scene._allSteps).reduce((total, current) => total.concat(current), []);
        return allSteps.map(step => step.timeout).reduce((total, current) => total + current, 0);
    }

    get lastStep() {
        return this._completedSteps[this._completedSteps.length-1];
    }

    get stepsBeforeCurrent() {
        return this._subScenes.map(scene => scene.steps).concat(this._completedSteps);
    }

    addStep(step) {
        let stepDesc = new StepDescriber(step, this._context);
        this._allSteps.push(stepDesc);
    }

    loadScene(scene) {
        this._subScenes.push(scene);
    }

    async runSubScenes() {
        for(let subScene of this._subScenes) {
            subScene.executer = this.executer;
            await subScene.runSubScenes();
            await subScene.run();
        }
    }

    async run() {
        for(let step of this._allSteps) {
            await step.exec(this.executer);
            this._completedSteps.push(step);
        }
    }
}

