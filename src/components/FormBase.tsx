import React, { useState, useEffect } from 'react';
import { Formik, FormikConfig, FormikHelpers, FormikProps } from 'formik';
import { OperationResult } from 'urql';
import clsx from 'clsx';

import { Backdrop, Container, Paper, makeStyles, Typography, IconButton, Button, Box, CircularProgress } from '@material-ui/core';
import { useRowFlexStyles } from '@mui-treasury/styles/flex/row';
import CloseIcon from '@material-ui/icons/Close';
import MuiAlert from '@material-ui/lab/Alert';

export const useFormStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(4),
    },
    field: {
        width: '100%',
    },
    grid: {
        margin: 0,
        width: '100%',
    },
}));

export const useFormBaseStyles = makeStyles(theme => ({
    root: {
        zIndex: 1210,
        flexFlow: 'column nowrap',
        overflowY: 'scroll',
        overflowX: 'auto',
    },
    root2: {
        display: 'flex',
        flexFlow: 'column nowrap',
        paddingTop: 30,
        alignItems: 'center',
        minHeight: 300,
    },
    container: {
        flexGrow: 1,
        [theme.breakpoints.down('xs')]: {
            padding: 0,
        },
    },
    paper: {
        display: 'flex',
        position: 'relative',
        flexFlow: 'column nowrap',
        marginTop: theme.mixins.toolbar.minHeight,
        height: `calc(95vh - ${theme.mixins.toolbar.minHeight}px)`,
        padding: theme.spacing(0, 2),
        borderRadius: theme.shape.borderRadius,
        [theme.breakpoints.down('sm')]: {
            marginTop: 0,
            height: '100vh',
            borderRadius: 0,
        },
    },
    paperInline: {
        display: 'block',
        padding: theme.spacing(0, 2),
    },
    header: {
        display: 'flex',
        position: 'relative',
        flexFlow: 'row nowrap',
        alignItems: 'stretch',
    },
    headerInline: {
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(4),
    },
    content: {
        flexGrow: 1,
        width: `calc(100% + ${theme.spacing(4)}px)`,
        display: 'block',
        position: 'relative',
        margin: theme.spacing(0, -2),
        overflowY: 'scroll',
    },
    contentInline: {
        overflowY: 'auto',
    },
    footer: {
        padding: theme.spacing(1),
        display: 'flex',
        position: 'relative',
        flexFlow: 'row nowrap',
        alignItems: 'flex-end',
    },
}));

export type FormBaseConfig<V> = {
    handleSubmit(data: V, helpers: FormikHelpers<V>): Promise<OperationResult | string | null>;
    fetching?: boolean;
    inline?: boolean;
};

export type FormBaseProps<V> = Omit<FormikConfig<V>, 'onSubmit' | 'onReset' | 'component' | 'children'> &
    FormBaseConfig<V> & {
        onClose?(): void;
        primary: string;
        title?: React.ReactElement | string;
        subTitle?: React.ReactElement | string;
        children?: ((props: FormikProps<V>) => React.ReactNode) | React.ReactNode;
    };

const FormBaseContainer = ({ useBackdrop, children, classes }: any) =>
    useBackdrop ? (
        <Backdrop className={classes.root} open={true}>
            {children}
        </Backdrop>
    ) : (
        <Box>{children}</Box>
    );

const FormBaseLoaderContainer = ({ classes, children, fetching }: any) =>
    fetching ? (
        <Box className={clsx(classes.root2)}>
            <CircularProgress className={clsx(classes.headerInline)} />
        </Box>
    ) : (
        children
    );

const FormBaseHeader = ({ inline, classes, flex, onClose, title, subTitle }: any) => (
    <Box className={clsx(classes.header, inline && classes.headerInline)}>
        <Box flexGrow={1} flexDirection={'column'}>
            <Typography component="h2" variant="h6">
                {title}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
                {subTitle}
            </Typography>
        </Box>
        {!inline && onClose && (
            <IconButton className={flex.rightChild} onClick={onClose}>
                <CloseIcon />
            </IconButton>
        )}
    </Box>
);

export default function FormBase<Values>({
    title,
    primary,
    subTitle,
    children,
    fetching,
    inline = true,
    handleSubmit,
    onClose,
    ...props
}: FormBaseProps<Values>) {
    const [uialert, setAlert] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
    const [overflow] = useState<string | never>(() => document.body.style.overflow);
    const classes = useFormBaseStyles();
    const flex = useRowFlexStyles();

    useEffect(() => {
        !inline && (document.body.style.overflow = 'hidden');
        return () => {
            !inline && (document.body.style.overflow = overflow!);
        };
    });

    const Header = <FormBaseHeader inline={inline} classes={classes} flex={flex} onClose={onClose} title={title} subTitle={subTitle} />;

    return (
        <React.Fragment>
            <FormBaseContainer classes={classes} useBackdrop={!inline}>
                <Container className={classes.container} maxWidth={'md'}>
                    {inline && Header}
                    <Paper className={clsx(inline ? classes.paperInline : classes.paper)} square={!inline}>
                        {!inline && Header}
                        <FormBaseLoaderContainer classes={classes} fetching={fetching}>
                            <Formik
                                {...props}
                                onReset={() => setAlert(null)}
                                onSubmit={(data, helpers) =>
                                    handleSubmit(data, helpers)
                                        .then(opRes => {
                                            if (opRes === null) {
                                                setAlert({ message: 'Could not save', severity: 'error' });
                                            } else if (typeof opRes === 'string') {
                                                setAlert({ message: opRes, severity: 'success' });
                                            } else {
                                                if (opRes.error) {
                                                    setAlert({ message: opRes.error?.message, severity: 'error' });
                                                } else if (opRes.data) {
                                                    return setAlert({ message: 'Successfully saved', severity: 'success' });
                                                }
                                            }
                                        })
                                        .catch(error => {
                                            setAlert({ message: error.message, severity: 'error' });
                                        })
                                }
                            >
                                {formikProps => (
                                    <>
                                        <Box className={clsx(classes.content, inline && classes.contentInline)}>
                                            {children && (typeof children === 'function' ? children(formikProps) : children)}
                                        </Box>
                                        {uialert && (
                                            <MuiAlert severity={uialert?.severity} onClose={() => setAlert(null)}>
                                                {uialert?.message}
                                            </MuiAlert>
                                        )}
                                        <Box className={classes.footer}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                size="large"
                                                disabled={formikProps.isSubmitting}
                                                onClick={formikProps.submitForm}
                                            >
                                                {primary}
                                            </Button>
                                        </Box>
                                    </>
                                )}
                            </Formik>
                        </FormBaseLoaderContainer>
                    </Paper>
                </Container>
            </FormBaseContainer>
        </React.Fragment>
    );
}
