type GenerateStringUnion<T> = Extract<
    {
        [Key in keyof T]: true extends T[Key] ? Key : never;
    }[keyof T],
    string
    >;

type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

type Overwrite<T, U> = DistributiveOmit<T, keyof U> & U;

type OverridableStringUnion<T extends string | number, U = {}> = GenerateStringUnion<
    Overwrite<Record<T, true>, U>
    >;

interface BreakpointOverrides {}

export type Breakpoint = OverridableStringUnion<
    'xs' | 'sm' | 'md' | 'lg' | 'xl',
    BreakpointOverrides
    >;

export interface Breakpoints {
    keys: Breakpoint[];
    values: { [key in Breakpoint]: number };
    up: (key: Breakpoint) => string;
    down: (key: Breakpoint) => string;
    between: (start: Breakpoint, end: Breakpoint) => string;
    only: (key: Breakpoint) => string;
    not: (key: Breakpoint) => string;
}

export interface Options extends Partial<Breakpoints> {
    step?: number | undefined;
    unit?: string | undefined;
}
