import React, { useState } from 'react';
import clsx from 'clsx';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';
import IsOkIcon from '@material-ui/icons/CheckCircleOutline';

import CircularProgress from '@material-ui/core/CircularProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Button, { ButtonProps } from '@material-ui/core/Button';

export const useButtonDangerStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.error.main,
        borderColor: theme.palette.error.main,
        margin: theme.spacing(0.3),
    },
}));

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0.3),
        maxWidth: theme.breakpoints.width('sm'),
    },
    text: {
        marginRight: theme.spacing(0.3),
        verticalAlign: 'super',
    },
    vertical: {
        display: 'flex',
        flexDirection: 'column-reverse',
    },
    horizontal: {
        display: 'block',
    },
}));

type Node = {
    id?: string | number;
};

type Index = number | string;

// eslint-disable-next-line @typescript-eslint/ban-types
export type AsyncActionButtonProps<T extends Node, P = {}> = Omit<ButtonProps<'button', P>, 'onClick' | 'startIcon'> & {
    index: Index;
    data?: T;
    icon?: ButtonProps<'button', P>['startIcon'];
    description?: React.ReactNode;
    direction?: 'vertical' | 'horizontal';
    onClick(data: T | null, index: Index): Promise<boolean>;
    onRemove(index: Index): void;
};

function AsyncActionButton<T extends Node>(
    {
        index,
        data,
        description,
        disabled,
        direction = 'horizontal',
        icon = <RemoveIcon />,
        onClick,
        onRemove,
        ...props
    }: AsyncActionButtonProps<T>,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const [fetching, setFetching] = useState<boolean>(false);
    const [successfullly, isSucess] = useState<boolean>(false);
    const containerStyles = useStyles();

    const startIcon = fetching ? <CircularProgress /> : successfullly ? <IsOkIcon /> : icon;
    const disableButton = disabled || fetching || successfullly;

    return (
        <div ref={ref} className={clsx(containerStyles[direction], containerStyles.root)}>
            <Typography variant="caption" component="span" color="textSecondary" className={containerStyles.text}>
                {description}
            </Typography>
            <Button
                disabled={disableButton}
                startIcon={startIcon}
                onClick={() => {
                    setFetching(true);
                    onClick(data ?? null, index)
                        .then(forRemove => {
                            forRemove && onRemove(index);
                            isSucess(forRemove);
                        })
                        .finally(() => setFetching(false));
                }}
                {...props}
            />
        </div>
    );
}

export default React.forwardRef(AsyncActionButton);
