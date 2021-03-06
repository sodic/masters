import { parse } from './parser';
import { check } from './semantics';
import { Context } from './semantics/types/context';
import { generateJs } from './codeGeneration';
import { failure, isFailure, isSuccess, Result, success } from './util';

export interface CompilerOutput {
    types: Context;
    code: string;
}

export function compileVerbose(source: string): Result<CompilerOutput, string> {
    const parserResult = parse(source);
    if (isFailure(parserResult)) {
        return failure(parserResult.error);
    }

    const ast = parserResult.value;
    const types = check(ast);
    if (isFailure(types)) {
        return failure(types.error);
    }

    const code = generateJs(ast);
    if (isFailure(code)) {
        return failure(`Code Generation Error: ${code.error}`);
    }

    return success({
        ast,
        types: types.value,
        code: code.value,
    });
}

export function compile(source: string): Result<string, string> {
    const result = compileVerbose(source);
    return isSuccess(result) ? success(result.value.code) : failure(result.error);
}
