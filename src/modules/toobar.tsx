import React from 'react';
import { generatePath } from 'react-router-dom';
import BackIcon from '@material-ui/icons/ArrowBack';
import CancelIcon from '@material-ui/icons/CancelOutlined';

import { IconButtonLink } from '../components/Link';
import { ToolbarAction, ToolbarActions, useConfigToolbar, IConfigureHeader } from '../components/layout/header';

// eslint-disable-next-line @typescript-eslint/ban-types
export type WrapperProps<T = {}> = React.PropsWithChildren<T & { fallback: string }>;

export const getBackPath = (path: string, params: { to: string }) => generatePath(`${path}/:to`, params) + `?from=${path}`;

export const CleanActions: React.FC = () => <ToolbarActions>{/* clean topbar actions*/}</ToolbarActions>;

export const ActionBack: React.FC<{ to: string }> = props => (
    <ToolbarAction>
        <IconButtonLink {...props}>
            <BackIcon />
        </IconButtonLink>
    </ToolbarAction>
);

export const ActionClose: React.FC<{ to: string }> = props => (
    <ToolbarAction>
        <IconButtonLink {...props}>
            <CancelIcon />
        </IconButtonLink>
    </ToolbarAction>
);

// eslint-disable-next-line react/prop-types
export const ToolbarTitle: React.FC<IConfigureHeader> = ({ children, ...config }) => {
    useConfigToolbar(config);
    return <React.Fragment>{children}</React.Fragment>;
};
