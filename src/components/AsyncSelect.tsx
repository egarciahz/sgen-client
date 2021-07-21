import React from 'react';
import AsyncAutocomplete from './AsyncAutoComplete';

type ID = number | string;

type INode = {
    id: ID;
    name: string;
};

export type CursorOptions = {
    offset: number;
    limit: number;
};

export type FetchOptions<Value extends INode> = CursorOptions & {
    value: Value | null;
};

export type SelectComponentProps<T extends INode> = {
    value: T | null;
    label: React.ReactNode;
    error: boolean;
    fetching: boolean;
    options: Array<T>;
    onChange(selected: T | null): void;
    onFetch(cursor: CursorOptions): void;
};

export const DEFAULT_CURSOR_VALUE: CursorOptions = {
    offset: 0,
    limit: 10,
};

export default function AsyncSelect<T extends INode>({
    label,
    value,
    error,
    fetching,
    options,
    onChange,
    onFetch,
}: SelectComponentProps<T>) {
    return (
        <AsyncAutocomplete
            label={label}
            isItemLoaded={index => Boolean(options[index])}
            loading={fetching}
            options={options}
            loadMoreItems={(start, end) =>
                Promise.resolve(
                    onFetch({
                        offset: options.length - 1,
                        limit: start + end - options.length,
                    })
                )
            }
            variant="outlined"
            multiple={false}
            value={value}
            error={error}
            onChange={(_, selected, action) => {
                if (action === 'clear') {
                    selected = null;
                }
                return onChange(selected);
            }}
        />
    );
}
