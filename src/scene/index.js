const assert = require('assert');
const Step = require('../step');
const Executer = require('../executer');
const compile = require('./compile');

module.exports = class Scene {
    constructor(definition, executer) {
        let {name, steps} = compile(definition);
        this.name = name;
        this.steps = steps;
        this.executer = executer;
    }

    get timeout() {
        return this._allSteps.map(step => step.timeout).reduce((total, current) => total + current, 0);
    }

    get prerequisitesTimeout() {
        let allSteps = this._subScenes.map(scene => scene._allSteps).reduce((total, current) => total.concat(current), []);
        return allSteps.map(step => step.timeout).reduce((total, current) => total + current, 0);
    }

    async init() {
        
    }

    async runSubScenes(top = true) {
        if(top) topScene = this;
        for(let subScene of this._subScenes) {
            //subScene.executer = this.executer;
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
}

