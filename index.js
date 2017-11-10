const Scene = require('./scene');
const Executer = require('./executer');

module.exports = {
    setExecuter: executerClass => Executer.setClass(executerClass),
    createScene: desc => new Scene(desc, Executer.create())
};

//todo set context in scene.