/**
 * Remove properties `K` from `T`.
 * Distributive for union types.
 *
 * @internal
 */
export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

/**
 * Generate a set of string literal types with the given default record `T` and
 * override record `U`.
 *
 * If the property value was `true`, the property key will be added to the
 * string union.
 *
 * @internal
 */
export type OverridableStringUnion<T extends string | number, U = {}> = GenerateStringUnion<
    Overwrite<Record<T, true>, U>
    >;

/**
 * Like `T & U`, but using the value types from `U` where their properties overlap.
 *
 * @internal
 */
export type Overwrite<T, U> = DistributiveOmit<T, keyof U> & U;

type GenerateStringUnion<T> = Extract<
    {
        [Key in keyof T]: true extends T[Key] ? Key : never;
    }[keyof T],
    string
    >;

export interface BreakpointOverrides {}

export type Breakpoint = OverridableStringUnion<
    'xs' | 'sm' | 'md' | 'lg' | 'xl',
    BreakpointOverrides
    >;

export interface Breakpoints {
    keys: Breakpoint[];
    /**
     * Each breakpoint (a key) matches with a fixed screen width (a value).
     * @default {
     *    // extra-small
     *    xs: 0,
     *    // small
     *    sm: 600,
     *    // medium
     *    md: 900,
     *    // large
     *    lg: 1200,
     *    // extra-large
     *    xl: 1536,
     * }
     */
    values: { [key in Breakpoint]: number };
    /**
     * @param key - A breakpoint key (`xs`, `sm`, etc.) or a screen width number in px.
     * @returns A media query string ready to be used with most styling solutions, which matches screen widths greater than the screen size given by the breakpoint key (inclusive).
     * @see [API documentation](https://mui.com/customization/breakpoints/#theme-breakpoints-up-key-media-query)
     */
    up: (key: Breakpoint | number) => string;
    /**
     * @param key - A breakpoint key (`xs`, `sm`, etc.) or a screen width number in px.
     * @returns A media query string ready to be used with most styling solutions, which matches screen widths less than the screen size given by the breakpoint key (exclusive).
     * @see [API documentation](https://mui.com/customization/breakpoints/#theme-breakpoints-down-key-media-query)
     */
    down: (key: Breakpoint | number) => string;
    /**
     * @param start - A breakpoint key (`xs`, `sm`, etc.) or a screen width number in px.
     * @param end - A breakpoint key (`xs`, `sm`, etc.) or a screen width number in px.
     * @returns A media query string ready to be used with most styling solutions, which matches screen widths greater than
     *          the screen size given by the breakpoint key in the first argument (inclusive) and less than the screen size given by the breakpoint key in the second argument (exclusive).
     * @see [API documentation](https://mui.com/customization/breakpoints/#theme-breakpoints-between-start-end-media-query)
     */
    between: (start: Breakpoint | number, end: Breakpoint | number) => string;
    /**
     * @param key - A breakpoint key (`xs`, `sm`, etc.) or a screen width number in px.
     * @returns A media query string ready to be used with most styling solutions, which matches screen widths starting from
     *          the screen size given by the breakpoint key (inclusive) and stopping at the screen size given by the next breakpoint key (exclusive).
     * @see [API documentation](https://mui.com/customization/breakpoints/#theme-breakpoints-only-key-media-query)
     */
    only: (key: Breakpoint) => string;
    /**
     * @param key - A breakpoint key (`xs`, `sm`, etc.).
     * @returns A media query string ready to be used with most styling solutions, which matches screen widths stopping at
     *          the screen size given by the breakpoint key (exclusive) and starting at the screen size given by the next breakpoint key (inclusive).
     */
    not: (key: Breakpoint) => string;
}

export interface BreakpointsOptions extends Partial<Breakpoints> {
    /**
     * The increment divided by 100 used to implement exclusive breakpoints.
     * For example, `step: 5` means that `down(500)` will result in `'(max-width: 499.95px)'`.
     * @default 5
     */
    step?: number | undefined;
    /**
     * The unit used for the breakpoint's values.
     * @default 'px'
     */
    unit?: string | undefined;
}
