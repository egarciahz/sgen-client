import React from 'react';
import clsx from 'clsx';
import { AppBar, Toolbar, Box, Typography } from '@material-ui/core'; //  CircularProgress, Fade
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
    createStyles({
        toolbar: {
            minHeight: '64px !important',
            backgroundColor: '#fff',
            boxShadow: 'inset 0 -1px 0 rgba(100,121,143,0.122)',
        },
        container: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        brandContainer: {
            justifyContent: 'flex-start',
        },
        menuContainer: {
            flexGrow: 1,
            justifyContent: 'flex-end',
        },
        titleText: {
            width: 172,
            fontSize: 12,
            marginLeft: 12,
            color: '#54646d',
            fontWeight: 'bold',
        },
        collapse: {
            marginLeft: -12,
            marginRight: 4,
        },
    })
);

interface HeaderProps {
    children?: React.ReactElement | React.ReactElement[];
    MenuIcon?: React.ReactElement;
    BrandIcon?: React.ReactElement;
    subTitle?: string;
    className?: string;
}

export default function Header({ children, MenuIcon, BrandIcon, subTitle, className }: HeaderProps) {
    const classes = useStyles();
    return (
        <AppBar position="fixed" variant="elevation" color="inherit" className={className}>
            <Toolbar className={clsx(classes.toolbar)}>
                <Box display="flex" alignItems="center" flexDirection="column">
                    <Box className={clsx(classes.container, classes.brandContainer)}>
                        <Box className={classes.collapse}>{MenuIcon}</Box>
                        <Box display="flex" flexDirection="column">
                            {BrandIcon}
                            <Box display="flex">
                                {/* <Fade in={loading} mountOnEnter unmountOnExit>
                                <CircularProgress size={12} />
                            </Fade> */}
                                <Typography component="b" variant="h6" className={classes.titleText}>
                                    {subTitle}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box className={clsx(classes.container, classes.menuContainer)}>{children}</Box>
            </Toolbar>
        </AppBar>
    );
}
