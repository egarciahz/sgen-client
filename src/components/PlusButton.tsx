import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { Theme } from '@material-ui/core';

import Add from '@material-ui/icons/AddOutlined';

export type PlusButtonStyleProps = {
    collapsed: boolean;
};

export type PlusButtonClassKey = 'root' | 'label' | 'img' | 'startIcon';

export const plusButtonStyles = ({ palette }: Theme) => {
    return {
        root: ({ collapsed }: PlusButtonStyleProps) => ({
            margin: 5,
            minWidth: collapsed ? 56 : 64,
            minHeight: collapsed ? 56 : 48,
            backgroundColor: palette.common.white,
            padding: `8px ${collapsed ? '8px' : '24px'} 8px ${collapsed ? '8px' : '16px'}`,
            borderRadius: 40,
            boxShadow: '0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149)',
            '&:hover': {
                boxShadow: '0 1px 3px 0 rgba(60,64,67,0.302), 0 4px 8px 3px rgba(60,64,67,0.149)',
                backgroundColor: '#fafafb',
            },
            '&:active': {
                backgroundColor: '#f1f3f4',
            },
        }),
        label: {
            fontFamily: "'Google Sans', Roboto,RobotoDraft,Helvetica,Arial,sans-serif",
            color: '#3c4043',
            textTransform: 'none' as const,
            fontWeight: 500,
        },
        img: {
            width: 32,
            height: 32,
        },
        startIcon: ({ collapsed }: PlusButtonStyleProps) => ({
            margin: collapsed ? 0 : '',
        }),
    };
};

export type PlusButtonProps<P extends Record<string, any>> = P & {
    label?: string;
    color?: string;
    collapsed: boolean;
    component?: React.ElementType<P>;
    classes?: Partial<Record<PlusButtonClassKey, string>>;
} & Omit<ButtonProps, 'color'>;

const useStyles = makeStyles(plusButtonStyles, { name: 'PlusButton' });

export default function PlusButton<P>({ collapsed, classes, label, color = '#7cc045', ...props }: PlusButtonProps<P>) {
    const styles = useStyles({ collapsed, ...props });
    const { img: imgClassName, ...buttonClasses } = styles;
    return (
        <Button {...props} disableRipple classes={buttonClasses} startIcon={<Add className={imgClassName} style={{ color }} />}>
            {!collapsed && label}
        </Button>
    );
}
