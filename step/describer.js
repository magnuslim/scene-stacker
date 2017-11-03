const assert = require('assert');

module.exports = class {
    constructor({name, timeout = 2000,prepareRequest, handleResponse}) {
        assert(typeof name === 'string', 'StepDescriber: expect name to be a string.');
        assert(typeof prepareRequest === 'function', 'StepDescriber: expect prepareRequest to be a function.');
        assert(typeof handleResponse === 'function', 'StepDescriber: expect handleResponse to be a function.');
        this.name = name;
        this.timeout = timeout;
        this.request = undefined;
        this.error = undefined;
        this.response = undefined;
        this._prepareRequest = prepareRequest;
        this._handleResponse = handleResponse;
    }
    async exec(executer) {
        this.request = await this._prepareRequest().catch(err => {
            throw new Error(`[${this.name}] ${err.message}`);
        });
        try {
            this.response = await executer.run(this.name, this.request)
        }catch(err) {
            this.error = err;
        }
        let contextPairs = await this._handleResponse(this.error, this.response).catch(err => {
            throw new Error(`[${this.name}] ${err.message}`);
        });
        assert(contextPairs == null || typeof contextPairs == 'object', 'expect returns of step._handleResponse() to be null or key-value pairs.');
        if(contextPairs != null) {
            Object.keys(contextPairs).map(key => executer.setContext(key, contextPairs[key]));
        }
    }
}