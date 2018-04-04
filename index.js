const Scene = require('./src/scene');
const Executer = require('./src/executer');

module.exports = {
    setExecuter: executerClass => Executer.setClass(executerClass),
    createScene: desc => new Scene(desc, Executer.create())
};

//todo set context in scene.