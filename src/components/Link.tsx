import React, { useMemo } from 'react';
import { Link, LinkProps, useLocation, useHistory } from 'react-router-dom';
import Button, { ButtonProps } from '@material-ui/core/Button';
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';

export function useIsSelected({ to, replace }: Pick<LinkProps, 'to' | 'replace'>): boolean {
    const Location = useLocation();
    const selected = useMemo(() => {
        return [to, replace].filter(v => !!v).includes(Location.pathname);
    }, [Location.pathname, to, replace]);

    return selected;
}

type ButtonLinkProps = Pick<
    ButtonProps,
    'color' | 'variant' | 'disabled' | 'className' | 'title' | 'style' | 'startIcon' | 'endIcon' | 'disableElevation' | 'size'
> &
    Pick<LinkProps, 'to' | 'replace' | 'children'>;

export function ButtonLink({ children, to, replace, variant, ...props }: ButtonLinkProps) {
    const selected = useIsSelected({ to, replace });
    return (
        <Button component={Link} to={to} replace={replace} variant={selected ? 'contained' : variant} {...props}>
            {children}
        </Button>
    );
}

type MenuItemLinkProps = { to: string } & Pick<LinkProps, 'replace'> &
    Pick<MenuItemProps, 'className' | 'classes' | 'title' | 'style' | 'disabled' | 'disableGutters' | 'unselectable' | 'children'>;

export const MenuItemLink = React.forwardRef(function MenuItemLink(
    { children, to, replace, ...props }: MenuItemLinkProps,
    forwadedRef: any
) {
    const Navigation = useHistory();
    const selected = useIsSelected({ to, replace });

    return (
        <MenuItem ref={forwadedRef} onClick={() => (replace ? Navigation.replace(to) : Navigation.push(to))} selected={selected} {...props}>
            {children}
        </MenuItem>
    );
});

type IconButtonLinkProps = IconButtonProps & Pick<LinkProps, 'to' | 'replace' | 'children'>;

export function IconButtonLink({ children, to, replace, ...props }: IconButtonLinkProps) {
    return (
        <Link {...{ to, replace }}>
            <IconButton {...props}>{children}</IconButton>
        </Link>
    );
}

type ListItemLinkProps = Omit<ListItemProps, 'button'> & Pick<LinkProps, 'to' | 'replace' | 'children'>;

export function ListItemLink({ children, to, replace, ...props }: ListItemLinkProps) {
    const selected = useIsSelected({ to, replace });
    return (
        <Link {...{ to, replace }}>
            <ListItem selected={selected} {...props}>
                {children}
            </ListItem>
        </Link>
    );
}
