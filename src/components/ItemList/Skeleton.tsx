import React from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import { useRowGutterStyles } from '@mui-treasury/styles/gutter/row';
import { useStyles } from './style';

import Skeleton from '@material-ui/lab/Skeleton';
import { ItemSkeleton } from './ItemActions';
import { ActionIconSize } from './ItemList';

type ItemListSkeletonProps = {
    actions: number;
    leftIcon?: boolean;
    subTitle?: boolean;
};

export default function ItemListSkeleton({ actions, leftIcon, subTitle }: ItemListSkeletonProps) {
    const gutterStyles = useRowGutterStyles({ size: '0.25rem' });
    const itemStyles = useStyles();

    return (
        <Box className={clsx(itemStyles.item, gutterStyles.parent)}>
            <Box className={itemStyles.avatar}>{leftIcon && <ItemSkeleton actions={1} size={32} />}</Box>
            <Box display="flex" flex="1 0 auto" flexDirection="column">
                <Skeleton variant="text" width={'90%'} animation="wave" />
                {subTitle && <Skeleton variant="text" width={'55%'} animation="wave" />}
            </Box>
            <Box display="flex">
                <ItemSkeleton actions={actions} size={ActionIconSize} />
            </Box>
        </Box>
    );
}
