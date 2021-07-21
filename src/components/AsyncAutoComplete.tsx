import React, { useContext, useState } from 'react';
import { pick, omit } from 'lodash';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { AutocompleteProps } from '@material-ui/lab/Autocomplete';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

export interface IHandleLoadingContext {
    threshold?: number;
    minimumBatchSize?: number;
    isItemLoaded: (index: number) => boolean;
    loadMoreItems: (startIndex: number, stopIndex: number) => Promise<any> | null;
}

export type AutocompleteTypeOmitMap =
    | 'options'
    | 'loading'
    | 'open'
    | 'onOpen'
    | 'onClose'
    | 'getOptionLabel'
    | 'getOptionSelected'
    | 'renderOption'
    | 'renderInput'
    | 'freeSolo';

export interface AutocompleteSelectProps<
    T,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean
> extends Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, AutocompleteTypeOmitMap> {
    variant?: 'standard' | 'outlined' | 'filled';
    error?: boolean;
    label?: React.ReactNode;
}

export function fieldToHandler(props: IHandleLoadingContext): IHandleLoadingContext {
    return pick(props, 'isItemLoaded', 'loadMoreItems', 'minimumBatchSize', 'threshold');
}

export function filterHandlerFields<T extends IHandleLoadingContext>(props: T): Omit<T, keyof IHandleLoadingContext> {
    return omit(props, 'isItemLoaded', 'loadMoreItems', 'minimumBatchSize', 'threshold');
}

export const useAutocompleteStyles = makeStyles({
    option: {
        fontSize: 15,
        '& > span': {
            marginRight: 10,
            fontSize: 18,
        },
        '& > small': {
            marginLeft: 10,
            fontSize: 9,
        },
    },
});

const PADDING = 8;

const HandleLoadingContext = React.createContext<IHandleLoadingContext>({
    isItemLoaded() {
        throw new Error('Not yet implemented');
    },
    loadMoreItems() {
        return Promise.reject('Not yet implemented');
    },
});
const HandleLoadingProvider = HandleLoadingContext.Provider;
const useHandleLoading = () => useContext(HandleLoadingContext);
const OuterElementContext = React.createContext<Record<string, any>>({});

const OuterElementType = React.forwardRef<HTMLDivElement>(function OuterElement(props, ref) {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache<T = any>(data: T) {
    const ref = React.useRef<VariableSizeList>(null);
    React.useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}
function renderRow(props: ListChildComponentProps) {
    const { data, index, style } = props;
    return React.cloneElement(data[index], {
        style: {
            ...style,
            top: (style.top as number) + PADDING,
        },
    });
}
// Adapter for react-window
const AsyncListboxComponent = React.forwardRef<HTMLDivElement>(function ListboxComponent(props, ref) {
    // eslint-disable-next-line react/prop-types
    const { children, ...other } = props;
    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
    const itemData = React.Children.toArray(children);
    const infiniteProps = useHandleLoading();
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;
    const gridRef = useResetCache(itemCount);
    return (
        <div ref={ref}>
            <OuterElementContext.Provider value={other}>
                <InfiniteLoader itemCount={itemCount + 1} {...infiniteProps}>
                    {infprops => (
                        <VariableSizeList
                            itemData={itemData}
                            height={itemSize * 5 + PADDING}
                            width="100%"
                            ref={gridRef}
                            outerElementType={OuterElementType}
                            innerElementType="ul"
                            itemSize={() => itemSize}
                            overscanCount={3}
                            itemCount={itemCount}
                            {...infprops}
                        >
                            {renderRow}
                        </VariableSizeList>
                    )}
                </InfiniteLoader>
            </OuterElementContext.Provider>
        </div>
    );
}) as React.ComponentType<React.HTMLAttributes<HTMLElement>>;

type Option = {
    id: string | number;
    name: string;
};

type AutoCompleteProps<
    T extends Option,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined
> = IHandleLoadingContext &
    AutocompleteSelectProps<T, Multiple, DisableClearable, false> & {
        loading?: boolean;
        options: Array<T>;
    };

function AsyncAutocomplete<T extends Option, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined>({
    value,
    onChange,
    defaultValue,
    ...props
}: AutoCompleteProps<T, Multiple, DisableClearable>) {
    const classes = useAutocompleteStyles();
    const [open, setOpen] = useState(false);
    const handler = fieldToHandler(props);
    const textProps = pick(props, 'label', 'variant', 'error');
    return (
        <HandleLoadingProvider value={handler}>
            <Autocomplete
                {...filterHandlerFields(props)}
                autoHighlight
                selectOnFocus
                classes={classes}
                value={value}
                onChange={onChange}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                ListboxComponent={AsyncListboxComponent}
                getOptionLabel={option => {
                    if (typeof option === 'string') {
                        return option;
                    }
                    return option.name;
                }}
                getOptionSelected={(option, value) => option.id === value?.id}
                renderInput={params => (
                    <TextField
                        {...params}
                        {...textProps}
                        InputProps={{
                            ...params.InputProps,
                            autoComplete: 'new-password', // disable autocomplete and autofill
                            endAdornment: (
                                <React.Fragment>
                                    <Fade in={props.loading} appear unmountOnExit mountOnEnter>
                                        <CircularProgress color="inherit" size={20} />
                                    </Fade>
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />
        </HandleLoadingProvider>
    );
}

export { AsyncListboxComponent, HandleLoadingProvider };
export default AsyncAutocomplete;
