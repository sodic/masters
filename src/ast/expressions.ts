export type Expression = Literal
    | Identifier
    | Lambda
    | Application
    | Conditional
    | Let;

export const enum ExpressionKind {
    Literal = 'Literal',
    Identifier = 'Identifier',
    Lambda = 'Lambda',
    Application = 'Application',
    Conditional = 'Conditional',
    Let = 'Let',
}

export const enum LiteralKind {
    BigInt = 'BigInt',
    Boolean = 'Boolean',
    Number = 'Number',
    Character = 'Character',
    Array = 'Array',
}

export interface Literal extends PossiblyParenthesized {
    kind: ExpressionKind.Literal;
    value: BooleanLiteral
        | BigintLiteral
        | NumberLiteral
        | CharacterLiteral
        | ArrayLiteral;
}

export interface BigintLiteral {
    kind: LiteralKind.BigInt;
    value: bigint;
}

export interface BooleanLiteral {
    kind: LiteralKind.Boolean;
    value: boolean;
}

export interface NumberLiteral {
    kind: LiteralKind.Number;
    value: number;
}

export interface CharacterLiteral {
    kind: LiteralKind.Character;
    value: string;
}

export interface ArrayLiteral {
    kind: LiteralKind.Array;
    contents: Expression[];
}

export interface Identifier extends PossiblyParenthesized {
    kind: ExpressionKind.Identifier;
    name: string;
}

export interface Lambda extends PossiblyParenthesized {
    kind: ExpressionKind.Lambda;
    head: string;
    body: Expression;
}

export interface Application extends PossiblyParenthesized {
    kind: ExpressionKind.Application;
    callee: Expression;
    argument: Expression;
}

export interface Conditional extends PossiblyParenthesized {
    kind: ExpressionKind.Conditional;
    condition: Expression;
    thenBranch: Expression;
    elseBranch: Expression;
}

export interface Let extends PossiblyParenthesized {
    kind: ExpressionKind.Let;
    variable: string;
    initializer: Expression;
    body: Expression;
}

export interface PossiblyParenthesized {
    parentheses?: true;
}
