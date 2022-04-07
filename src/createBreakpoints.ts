import { Options, Breakpoint, Breakpoints } from './types';

const sortBreakpointsValues = (values: { [key in Breakpoint]: number }) => {
    const breakpointsAsArray = (Object.keys(values) as (keyof typeof values)[]).map((key) => ({
        key,
        val: values[key]
    })) || [];

    breakpointsAsArray.sort((breakpoint1, breakpoint2) => breakpoint1.val - breakpoint2.val);

    return breakpointsAsArray.reduce((acc, obj) => ({
        ...acc,
        [obj.key]: obj.val
    }), {}) as { [key in Breakpoint]: number };
};

export function createBreakpoints(options: Options): Breakpoints {
    const {
        values = {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536
        },
        unit = 'px',
        step = 5
    } = options;

    const sortedValues = sortBreakpointsValues(values);
    const keys = Object.keys(sortedValues) as Breakpoint[];

    const up = (key: Breakpoint) => {
        return `@media (min-width:${values[key]}${unit})`;
    };

    const down = (key: Breakpoint) => {
        return `@media (max-width:${values[key] - step / 100}${unit})`;
    };

    const between = (start: Breakpoint, end: Breakpoint) => {
        const endIndex = keys.indexOf(end);

        return `@media (min-width:${values[start]}${unit}) and (max-width:${values[keys[endIndex]] - step / 100}${unit})`;
    };

    const only = (key: Breakpoint) => {
        if (keys.indexOf(key) + 1 < keys.length) {
            return between(key, keys[keys.indexOf(key) + 1]);
        }

        return up(key);
    };

    const not = (key: Breakpoint) => {
        const keyIndex = keys.indexOf(key);

        if (keyIndex === 0) {
            return up(keys[1]);
        }

        if (keyIndex === keys.length - 1) {
            return down(keys[keyIndex]);
        }

        return between(key, keys[keys.indexOf(key) + 1]).replace('@media', '@media not all and');
    };

    return {
        keys,
        values: sortedValues,
        up,
        down,
        between,
        only,
        not
    };
}
