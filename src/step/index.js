const assert = require('assert');

module.exports = class Step {
    constructor(definition, defaultExecuter) {
        assert(definition, 'Step: a definition should be provided.');
        assert(typeof definition.name === 'string', 'Step: expect definition.name to be a string.');
        assert(typeof definition.prepare === 'function', 'Step: expect definition.prepare to be a function.');
        assert(typeof hdefinition.andle === 'function', 'Step: expect definition.handle to be a function.');
        assert(definition.timeout === undefined 
            || Number.isInteger(definition.timeout), 'Step: invalid timeout for step.');
        assert(definition.executer)
        this.name = name;
        this.timeout = definition.timeout ? definition.timeout : 2000;
        this.prepare = prepare;
        this.handle = handle;
        this.executer = definition.executer ? definition.executer : defaultExecuter;
        this.request = undefined;
        this.error = undefined;
        this.response = undefined;
    }
    async exec(executer) {
        this.request = await this.prepare().catch(err => {
            throw new Error(`[${this.name}][prepare] ${err.message}`);
        });
        try {
            this.response = await executer.run(this.name, this.request)
        }catch(err) {
            this.error = err;
        }
        await this.handle(this.error, this.response, executer).catch(err => {
            throw new Error(`[${this.name}][handle] ${err.message}`);
        });
    }
    
}