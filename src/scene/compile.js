const assert = require('assert');
const Step = require('../step');

module.exports = function compile(definition) {
    assert(definition, 'a definition must be provided');
    let {name, prerequisites, steps} = definition;
    assert(prerequisites instanceof Array, `bad definition: ${name}, missing .prerequisites`);        
    assert(steps instanceof Array, `bad definition: ${name}, missing .steps`);
    
    let preSteps = [];
    prerequisites.forEach(prerequisite => {
        preSteps = preSteps.concat(compile(prerequisite).steps);
    });
    steps.forEach(stepDef => {
        preSteps.push(new Step(stepDef));
    });
    return {name, steps: preSteps};
};