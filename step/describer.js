const assert = require('assert');

module.exports = class Describer{
    constructor({name, timeout = 2000, prepareRequest, handleResponse}) {
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
        this.request = await this._prepareRequest(executer).catch(err => {
            throw new Error(`[${this.name}] ${err.message}`);
        });
        try {
            this.response = await executer.run(this.name, this.request)
        }catch(err) {
            this.error = err;
        }
        await this._handleResponse(this.error, this.response, executer).catch(err => {
            throw new Error(`[${this.name}] ${err.message}`);
        });
    }
    clone() {
        return new Describer({
            name: this.name, 
            timeout: this.timeout, 
            prepareRequest: this._prepareRequest, 
            handleResponse: this._handleResponse
        });
    }
}