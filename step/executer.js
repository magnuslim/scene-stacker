let Executer = class {
    run(apiName, request)  {throw new Error('must implement function executer.run(apiName, request)')}
};

module.exports = {
    setClass: executerClass => Executer = executerClass,
    create: () => new Executer()
}