import React from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useRowGutterStyles } from '@mui-treasury/styles/gutter/row';
import { ItemActions, Actions } from './ItemActions';
import { useStyles } from './style';

export const ActionIconSize = 24;

type ItemListProps = {
    actions: Actions;
    title: React.ReactNode;
    subTitle?: React.ReactNode;
    leftIcon?: React.ReactElement;
};

export default function ItemList(props: ItemListProps) {
    const gutterStyles = useRowGutterStyles({ size: '0.25rem' });
    const itemStyles = useStyles();

    const { title, subTitle, leftIcon, ...actionsProps } = props;

    return (
        <Box className={clsx(itemStyles.item, gutterStyles.parent)}>
            <Box className={itemStyles.avatar}>{leftIcon}</Box>
            <Box display="flex" flex="1 0 auto" flexDirection="column">
                <Typography variant="subtitle2">{title}</Typography>
                <Typography component="span" variant="body2" color="textSecondary">
                    {subTitle}
                </Typography>
            </Box>
            <Box display="flex">
                <ItemActions size={ActionIconSize} {...actionsProps} />
            </Box>
        </Box>
    );
}
