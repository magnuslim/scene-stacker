let Executer = class {
    async run(apiName, request)  {throw new Error('must implement function executer.run(apiName, request)')}
};

module.exports = {
    setClass: executerClass => Executer = executerClass,
    create: () => new Executer()
}