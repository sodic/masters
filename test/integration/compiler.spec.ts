import assert from 'assert';
import { compile } from '../../src';
import { isSuccess } from '../../src/util';
import { functionScheme } from '../../src/checker/inference/helpers';
import { NUMBER_SCHEME, NUMBER_TYPE } from '../../src/checker/types/common';

describe('compiler', function () {
    describe('compile', function () {
        it('should compile a function successfully', function () {
            const result = compile('func add(x, y) = x + y\nx = add(10.35, 1e-2)');
            assert(isSuccess(result));
            const { types, code } = result.value;
            assert.deepStrictEqual(types['add'], functionScheme(NUMBER_TYPE, NUMBER_TYPE, NUMBER_TYPE));
            assert.deepStrictEqual(types['x'], NUMBER_SCHEME);
            assert.deepStrictEqual(evaluateAndRead(code, 'x'), 10.35 + 1e-2);
        });
    });
});

function evaluateAndRead(source: string, variable: string) {
    return (new Function(`${source}\nreturn ${variable};`))();
}
