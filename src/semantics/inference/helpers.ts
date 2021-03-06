import { TVariable, Type } from '../types/type';
import { difference } from '../../util';
import {
    functionType,
    freeTypeVars,
    polymorphicType,
    typeVar,
    arrayType,
    tupleType,
    TupleParams,
} from '../types/builders';
import { EMPTY_SUBSTITUTION, substituteInType } from '../substitution';
import { Scheme } from '../types/scheme';
import { freeTypeVarsContext } from '../types/helpers';
import { Context } from '../types/context';

export class NameError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export function typeVarGenerator(): () => TVariable {
    let current = 0;

    return function newTypeVar(): TVariable {
        current += 1;
        return typeVar(`t${current}`);
    };
}

export function instantiate(scheme: Scheme, uniqueTypeVar: () => TVariable = typeVarGenerator()): Type {
    const sub = [...scheme.bound].reduce(
        (sub, oldName) => ({ ...sub, [oldName]: uniqueTypeVar() }),
        EMPTY_SUBSTITUTION,
    );
    return substituteInType(sub, scheme.type);
}

export function functionScheme(type1: Type, type2: Type, ...types: Type[]): Scheme {
    return generalize({}, functionType(type1, type2, ...types));
}

export function polymorphicScheme(constructor: string, parameters: Type[]): Scheme {
    return generalize({}, polymorphicType(constructor, parameters));
}

export function arrayScheme(type: Type): Scheme {
    return generalize({}, arrayType(type));
}

export function tupleScheme(...types: TupleParams): Scheme {
    return generalize({}, tupleType(...types));
}

export function generalize(context: Context, type: Type): Scheme {
    const freeVars = difference(freeTypeVars(type), freeTypeVarsContext(context));
    return humanFriendlyScheme({
        bound: freeVars,
        type,
    });
}

/**
 * Renames the scheme's type variables to be more human friendly
 */
type TVarSubstitution = {
    [name: string]: TVariable;
};

function humanFriendlyScheme(scheme: Scheme): Scheme {
    const newTypeVar = typeVarGenerator();

    const renamingSubstitution: TVarSubstitution = [...scheme.bound].reduce(
        (acc, varName) => ({ ...acc, [varName]: newTypeVar() }),
        EMPTY_SUBSTITUTION as TVarSubstitution,
    );
    const renamedBoundVariables = new Set(
        [...scheme.bound].map(varName => renamingSubstitution[varName].name),
    );

    return {
        bound: renamedBoundVariables,
        type: substituteInType(renamingSubstitution, scheme.type),
    };
}
