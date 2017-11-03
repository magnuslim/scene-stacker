let Executer = class {
    run(apiName, request)  {throw new Error('must implement function executer.run(apiName, request)')}
    setContext(key, value) {throw new Error('must implement function executer.setContext(key, value)')}
};

module.exports = {
    setClass: executerClass => Executer = executerClass,
    create: () => new Executer()
}