/* eslint-disable react/prop-types */
import React, { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import DisabledIcon from '@material-ui/icons/SyncDisabledOutlined';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

import { ToolbarActions } from '../../components/layout/header';
import { ButtonLink } from '../../components/Link';
import ActionAlert from '../../components/ActionAlert';
import { ActionClose, ToolbarTitle, WrapperProps } from '../toobar';

export default function UpdatePeoject({ fallback }: WrapperProps) {
    const [opened, setOpen] = useState<boolean>(false);
    const handleStatus = useCallback(
        payload => {
            console.log(payload);
            setOpen(!opened);
        },
        [opened, setOpen]
    );
    const { id } = useParams<{ id: string }>();
    const actions = useMemo(
        () => [
            <Button
                onClick={() => {
                    setOpen(!opened);
                }}
                key="action-view-account"
                variant="outlined"
                startIcon={<DisabledIcon />}
            >
                DISABLE
            </Button>,
            <ButtonLink to={`${fallback}/${id}/remove`} key="action-delete" variant="outlined" color="secondary" startIcon={<RemoveIcon />}>
                DELETE
            </ButtonLink>,
        ],
        [id]
    );

    return (
        <div>
            <ActionClose to={fallback} />
            <ToolbarTitle title="Person Details" />
            <ToolbarActions>{actions}</ToolbarActions>
            <Box>{/* CODE HERE */}</Box>
            <ActionAlert title={'Enable resource'} primary="Accept" data={{ id }} open={opened} onClose={handleStatus} />
        </div>
    );
}
