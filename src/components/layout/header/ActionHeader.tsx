import React, { useEffect, createContext, useContext, useState, useRef, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MuiToolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';

import RefreshIcon from '@material-ui/icons/Refresh';
import { makeStyles, createStyles } from '@material-ui/styles';
import { useSizedIconButtonStyles } from '@mui-treasury/styles/iconButton/sized';
import { useRowGutterStyles } from '@mui-treasury/styles/gutter/row';
import { AppBar, Theme } from '@material-ui/core';
import { ItemActions } from '../../ItemList';

const useSubHeaderToolbarStyle = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            overflow: 'hidden',
            margin: theme.spacing(0, 2, 0, 2),
            flexFlow: 'column nowrap',
            alignItems: 'stretch',
            minHeight: theme.mixins.toolbar.height,
            [theme.breakpoints.down('xs')]: {
                margin: theme.spacing(0),
            },
        },
        dense: {
            minWidth: 300,
            height: 40,
            paddingBottom: 0,
            justifyContent: 'center',
            [theme.breakpoints.down('xs')]: {
                height: 82,
            },
        },
    })
);

const useSubHeaderStyles = makeStyles(() =>
    createStyles({
        paginbar: {
            flex: '1 0 auto',
            display: 'flex',
            alignItems: 'center',
            flexFlow: 'row wrap-reverse',
            justifyContent: 'space-between',
        },
        titlebar: {
            flex: 1,
            flexGrow: 1,
            display: 'inline-flex',
            alignItems: 'center',
        },
        commonWrapper: {
            flex: '1 0 auto',
            alignItems: 'center',
            display: 'inline-flex',
        },
    })
);

type IActionName = 'onback' | 'oncreate' | 'oncancell' | 'onrefresh';
type IActionHeaderState = {
    fetching: boolean;
    title?: string;
};
type IActionHeaderCtx<M> = {
    actionPortal: React.MutableRefObject<M>;
    actionsPortal: React.MutableRefObject<M>;
    dispatch(state: Partial<IActionHeaderState>): void;
    setEventCallback(id: IActionName, callback: () => unknown): void;
    getEventCallback(id: IActionName): void;
    callEvent(id: IActionName): void;
};
export type IConfigureHeader = Partial<Pick<IActionHeaderState, 'title' | 'fetching'>> & {
    onRefresh?(): void;
};

const ActionHeaderCtx = createContext<IActionHeaderState & IActionHeaderCtx<HTMLElement | null | undefined>>({
    dispatch() {
        throw new Error('Not yet implemented.');
    },
    setEventCallback() {
        throw new Error('Not yet implemented.');
    },
    getEventCallback() {
        throw new Error('Not yet implemented.');
    },
    callEvent() {
        throw new Error('Not yet implemented.');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);
ActionHeaderCtx.displayName = 'ActionHeader_Context';

function HeaderComponent() {
    const { fetching, title, callEvent, actionPortal, actionsPortal } = useContext(ActionHeaderCtx);
    const actionStyles = useSizedIconButtonStyles({ padding: 8, childSize: 20 });
    const gutterStyles = useRowGutterStyles({ size: '0.25rem', before: '0.5rem' });
    const classes = useSubHeaderToolbarStyle();
    const shStyles = useSubHeaderStyles();

    return (
        <MuiToolbar classes={classes} variant="dense">
            <Box className={shStyles.paginbar} key="paginator">
                <div
                    ref={el => {
                        actionPortal.current = el;
                    }}
                    style={{ marginRight: 4, display: 'inline-flex' }}
                    className={gutterStyles.parent}
                ></div>
                <Box ml="auto" justifyContent="space-between" className={clsx(gutterStyles.parent, shStyles.commonWrapper)}>
                    <Typography component="strong" variant="h6" color="textPrimary">
                        {title}
                    </Typography>
                    <Box ml="auto" justifyContent="flex-end" className={clsx(gutterStyles.parent, shStyles.commonWrapper)}>
                        <Fade in={fetching} mountOnEnter unmountOnExit>
                            <CircularProgress size={12} />
                        </Fade>
                        <div
                            ref={el => {
                                actionsPortal.current = el;
                            }}
                            style={{ justifyContent: 'space-between' }}
                            className={gutterStyles.parent}
                        ></div>
                        <Divider orientation="vertical" flexItem />
                        <IconButton disabled={fetching} classes={actionStyles} onClick={() => callEvent('onrefresh')}>
                            <RefreshIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </MuiToolbar>
    );
}

export function Toolbar({ children, ...initial }: React.PropsWithChildren<Partial<IActionHeaderState>>) {
    const [state, setState] = useState<IActionHeaderState>(() => ({
        fetching: false,
        action: null,
        title: '',
        actions: [],
        ...initial,
    }));

    const callbacks = useRef<Record<IActionName, null | (() => unknown)>>({
        onback: null,
        oncreate: null,
        oncancell: null,
        onrefresh: null,
    });
    const actionPortal = useRef<HTMLElement>();
    const actionsPortal = useRef<HTMLElement>();

    const dispatch = (next: Partial<IActionHeaderState>) => {
        setState({ ...state, ...next });
    };

    return (
        <ActionHeaderCtx.Provider
            value={{
                ...state,
                dispatch,
                actionPortal,
                actionsPortal,
                setEventCallback(id, cb) {
                    callbacks.current[id] = cb;
                },
                getEventCallback(id) {
                    return callbacks.current[id];
                },
                callEvent(id) {
                    const cb = callbacks.current[id];
                    cb && cb();
                },
            }}
        >
            <AppBar position="static" variant="outlined" color="inherit" style={{ border: 0 }}>
                <HeaderComponent />
            </AppBar>
            <div>{children}</div>
        </ActionHeaderCtx.Provider>
    );
}

export function useConfigToolbar({ onRefresh, title, fetching }: IConfigureHeader) {
    const { dispatch, setEventCallback } = useContext(ActionHeaderCtx);
    useEffect(() => {
        dispatch({ title, fetching });
    }, [title, fetching]);
    onRefresh !== undefined && setEventCallback('onrefresh', onRefresh);
}

export function ToolbarAction({ children }: { children?: React.ReactElement | null }) {
    const { actionPortal, dispatch, title } = useContext(ActionHeaderCtx);
    useLayoutEffect(() => {
        dispatch({ title });
    }, [children]);
    return actionPortal.current ? ReactDOM.createPortal(children ?? null, actionPortal.current) : null;
}

export function ToolbarActions({
    children,
    size = 24,
    limit = 2,
}: {
    children?: React.ReactElement[] | null;
    size?: number;
    limit?: number;
}) {
    const { actionsPortal, dispatch, title } = useContext(ActionHeaderCtx);
    useLayoutEffect(() => {
        dispatch({ title });
    }, [children]);
    return actionsPortal.current
        ? ReactDOM.createPortal(children ? <ItemActions size={size} maxCount={limit} actions={children} /> : null, actionsPortal.current)
        : null;
}
