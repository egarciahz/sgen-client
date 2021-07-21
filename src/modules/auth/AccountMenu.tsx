import React from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SettingIcon from '@material-ui/icons/SettingsApplicationsSharp';
import AccountIcon from '@material-ui/icons/SecurityRounded';
import ExitIcon from '@material-ui/icons/ExitToApp';
import { ActionMenu } from '../../components/ItemList';
import { MenuItemLink } from '../../components/Link';

export default function AccountMenu() {
    return (
        <ActionMenu
            icon={<SettingIcon />}
            actions={[
                <MenuItemLink key="account" to="/account">
                    <ListItemIcon>
                        <AccountIcon />
                    </ListItemIcon>
                    <ListItemText primary="Account" />
                </MenuItemLink>,
                <MenuItemLink key="exit-app" to="/sign-out">
                    <ListItemIcon>
                        <ExitIcon />
                    </ListItemIcon>
                    <ListItemText primary="Exit" />
                </MenuItemLink>,
            ]}
            size={32}
        />
    );
}
