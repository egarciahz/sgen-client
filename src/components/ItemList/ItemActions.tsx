import React, { useMemo, useState, useRef } from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import Skeleton from '@material-ui/lab/Skeleton';
import { Theme } from '@material-ui/core/styles';
import MoreVert from '@material-ui/icons/MoreVert';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { useSizedIconButtonStyles } from '@mui-treasury/styles/iconButton/sized';
import { useRowGutterStyles } from '@mui-treasury/styles/gutter/row';
import { useStyles } from './style';

export type Actions = React.ReactElement[];

export type ItemActionsProps<T extends Actions | number> = { size: number; actions: T };

export const ItemSkeleton = React.memo(function LoadingActionsComponent({ actions, size }: ItemActionsProps<number>) {
    const itemStyles = useStyles();
    const gutterStyles = useRowGutterStyles({ size: '0.25rem' });
    return (
        <Box className={clsx(gutterStyles.parent, itemStyles.actions)} ml={1} mr={0.5}>
            {Array(actions)
                .fill(null)
                .map((_, index) => (
                    <Skeleton key={index} variant="circle" animation="pulse" width={size} height={size} />
                ))}
        </Box>
    );
});

export const ActionMenu = React.memo(function ActionMenuComponent({
    size,
    actions,
    icon,
}: ItemActionsProps<Actions> & { icon: React.ReactNode }) {
    const actionStyles = useSizedIconButtonStyles({ padding: 2, childSize: size });
    const [opened, open] = useState<boolean>(false);
    const anchor = useRef<any>();

    return (
        <React.Fragment>
            <IconButton ref={anchor} classes={actionStyles} onClick={() => open(!opened)}>
                {icon}
            </IconButton>
            <Popper open={opened} anchorEl={anchor.current} role={undefined} transition disablePortal>
                <Fade appear in={opened}>
                    <Paper>
                        <ClickAwayListener onClickAway={() => open(false)}>
                            <MenuList autoFocusItem={opened}>{actions}</MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Fade>
            </Popper>
        </React.Fragment>
    );
});

export function ItemActions({ actions, size, maxCount = 2 }: ItemActionsProps<Actions> & { maxCount?: number }) {
    const mediaTrigger = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'));
    const actionStyles = useSizedIconButtonStyles({ padding: 4, childSize: size });
    const gutterStyles = useRowGutterStyles({ size: '0.25rem' });
    const itemStyles = useStyles();

    const buttons = useMemo(() => {
        const dense = actions.length > maxCount;
        const menu = (_actions: Actions) => <ActionMenu actions={_actions} size={size} icon={<MoreVert />} />;

        return mediaTrigger ? (
            menu(actions)
        ) : dense ? (
            <React.Fragment>
                {React.Children.map(actions.slice(0, maxCount), (item, index) =>
                    React.cloneElement<IconButtonProps>(item as any, {
                        classes: actionStyles,
                    })
                )}
                {menu(actions.slice(maxCount - 1))}
            </React.Fragment>
        ) : (
            actions
        );
    }, [actions, mediaTrigger, size]);

    return (
        <Box className={clsx(gutterStyles.parent, itemStyles.actions)} ml={1} mr={0.5}>
            {actions.length > 0 && buttons}
        </Box>
    );
}
