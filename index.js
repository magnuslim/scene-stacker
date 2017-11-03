const Scene = require('./scene');
const StepExecuter = require('./step/executer');

module.exports = {
    setExecuter: executerClass => StepExecuter.setClass(executerClass),
    createScene: desc => new Scene(desc)
};

//todo set context in scene.