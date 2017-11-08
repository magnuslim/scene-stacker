const assert = require('assert');
const StepDescriber = require('../step/describer');
const StepExecuter = require('../step/executer');

let topScene = undefined;

module.exports = class Scene{
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

    _lastStep() {
        return this._stepsBeforeCurrent()[this._stepsBeforeCurrent().length-1];
    }

    _stepsBeforeCurrent() {
        let allSteps = this._subScenes.reduce((allSteps, currentScene) => allSteps.concat(currentScene._stepsBeforeCurrent()), []);
        allSteps = allSteps.concat(this._completedSteps);
        return allSteps;
    }

    get lastStep() {
        return topScene._lastStep();
    }

    get stepsBeforeCurrent() {
        return topScene._stepsBeforeCurrent();
    }

    addStep(step) {
        let stepDesc = new StepDescriber(step);
        this._allSteps.push(stepDesc);
    }

    loadScene(scene) {
        assert(scene instanceof Scene, 'Scene.loadScene(): expect param tobe instanceof Scene.');
        this._subScenes.push(scene.clone());
    }

    async runSubScenes(top = true) {
        if(top) topScene = this;
        for(let subScene of this._subScenes) {
            subScene.executer = this.executer;
            subScene._parent = this;
            await subScene.runSubScenes(false);
            await subScene.run(false);
        }
    }

    async run(top = true) {
        if(top) topScene = this;
        for(let step of this._allSteps) {
            await step.exec(this.executer);
            this._completedSteps.push(step);
        }
    }

    clone() {
        let newScene = new Scene(this.desc);
        newScene._allSteps = this._allSteps.map(step => step.clone());
        newScene._subScenes = this._subScenes.map(scene => scene.clone());
        newScene._completedSteps = [];
        return newScene;
    }
}

