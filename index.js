const { lstatSync:stat, readdirSync:readdir } = require('fs');
const { join, resolve } = require('path');
const assert = require('assert');
const Executer = require('./src/executer');
const Scenario = require('./src/scene');

const _ = {
    root: undefined,
    executer: undefined,
    before: undefined,
    after: undefined,
    beforeEach: undefined,
    afterEach: undefined,
};

module.exports = {
    Executer,
    setup: ({
        scenarioRoot,
        executer,
        beforeAll  = async () => {},
        afterAll   = async () => {},
        beforeEach = async () => {},
        afterEach  = async () => {}
    }) => {       
        _.root = resolve(scenarioRoot);
        _.executer   = executer;
        _.before     = beforeAll;
        _.after      = afterAll;
        _.beforeEach = beforeEach;
        _.afterEach  = afterEach;
    },
    run: () => {
        for (const subFolder of readdir(_.root).filter(file => stat(join(_.root, file)).isDirectory())) {
            for (const scenarioName of readdir(join(_.root, subFolder)).filter(name => name.endsWith('.js')).map(name => name.replace(/\.js$/g, ''))) {            
                const scenario = new Scenario(require(join(_.root, join(subFolder, scenarioName))), _.executer);
                before(async function() {
                    await _.before();
                });
                after(async function() {
                    await _.after();
                });
                describe(subFolder, function() {
                    beforeEach(async function() {
                        this.timeout(5000);
                        await _.beforeEach();
                    });
                    afterEach(async function() {
                        this.timeout(5000);
                        await _.afterEach();
                    });
                    it(scenario.name, async function() {
                        this.timeout(scenario.timeout);
                        await scenario.run();
                    });
                });
            }
        }
    }
};
