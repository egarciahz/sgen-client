/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import AccountIcon from '@material-ui/icons/SecurityOutlined';
import Box from '@material-ui/core/Box';

import { ButtonLink } from '../../components/Link';

import { ActionClose, ActionBack, CleanActions, ToolbarTitle, WrapperProps } from '../toobar';

export default function Create({ fallback }: WrapperProps) {
    return (
        <div>
            <ActionBack to={fallback} />
            <ToolbarTitle title="Create New Project" />
            <CleanActions />
        </div>
    );
}
