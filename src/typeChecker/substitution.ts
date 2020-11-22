import { arrayType, Context, functionType, Scheme, Type } from './types';
import { assertUnreachable, mapObjectValues } from '../util';

export type Substitution = { [variableName: string]: Type };

export function substituteInType(sub: Substitution, type: Type): Type {
    switch (type.kind) {
    case 'function':
        return functionType(
            substituteInType(sub, type.input),
            substituteInType(sub, type.output),
        );
    case 'variable':
        return sub[type.name] ?? type;
    case 'number':
        return type;
    case 'boolean':
        return type;
    case 'bigint':
        return type;
    case 'array':
        return arrayType(substituteInType(sub, type.boxed));
    default:
        assertUnreachable(type);
    }
}

export function substituteInContext(sub: Substitution, context: Context): Context {
    const substitute = (scheme: Scheme) => substituteInScheme(sub, scheme);
    return mapObjectValues(context, substitute);
}

export function composeSubstitutions(...subs: Substitution[]): Substitution {
    return subs.reduce(
        (result, sub) => ({ ...result, ...sub }),
        {},
    );
}

function substituteInScheme(sub: Substitution, scheme: Scheme): Scheme {
    const cleanedSub = Object.keys(sub)
        .filter(typeVarName => !scheme.bound.has(typeVarName))
        .reduce((clean, currentKey) => ({ ...clean, [currentKey]: sub[currentKey] }), {});
    return {
        bound: scheme.bound,
        type: substituteInType(cleanedSub, scheme.type),
    };
}
