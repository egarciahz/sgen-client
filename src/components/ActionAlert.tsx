import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';

type Node = {
    id: number | string;
};
// 'Are you sure you want to delete this resource?'
// It is possible that this action is irreversible
interface ActionAlertProps<D extends Node> {
    onClose(option: D | null): void;
    description?: string;
    title: string;
    primary: string;
    open: boolean;
    data: D;
}

export default function ActionAlert<D extends Node>({ open, data, title, description, primary, onClose }: ActionAlertProps<D>) {
    return (
        <div>
            <Dialog
                open={open}
                onClose={() => onClose(null)}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        {description}
                        <br />
                        <span>If you are sure to continue press the</span>{' '}
                        <Typography gutterBottom color="textPrimary" component="b">
                            {primary.toUpperCase()}
                        </Typography>{' '}
                        button
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onClose(data)} color="inherit" variant="text">
                        {primary}
                    </Button>
                    <Button onClick={() => onClose(null)} color="primary" variant="outlined" autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
