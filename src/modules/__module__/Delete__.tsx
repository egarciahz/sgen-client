import React from 'react';
import { useParams } from 'react-router-dom';
import Box from '@material-ui/core/Box';

import { ActionClose, CleanActions, ToolbarTitle, WrapperProps } from '../toobar';
import { useButtonDangerStyles } from '../../components/AsyncActionButton';
import ActionNotice from '../../components/ActionNotice';
import NotFound from '../../components/NotFound';

export default function Delete({ fallback }: WrapperProps) {
    const { id } = useParams<{ id: string }>();
    const dangerClasses = useButtonDangerStyles();
    return (
        <div>
            <ActionClose to={`${fallback}/${id}`} />
            <ToolbarTitle title="Delete Project" />
            <CleanActions />
            <Box>
                {id == '0' ? (
                    <NotFound defaultUrl={`${fallback}/${id}`} title="Resource ID Not Found" />
                ) : (
                    <ActionNotice
                        title="Project Name"
                        primary="Delete"
                        overline="Delete Project"
                        description="Are you sure you want to delete this resource?"
                        onClick={() => Promise.resolve(true)}
                        classes={dangerClasses}
                    />
                )}
            </Box>
        </div>
    );
}
