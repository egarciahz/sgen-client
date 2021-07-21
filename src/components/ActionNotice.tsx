import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';

import TextInfoContent from '@mui-treasury/components/content/textInfo';
import RemoveButtom, { AsyncActionButtonProps } from './AsyncActionButton';

type ActionNoticeProps<T> = Pick<AsyncActionButtonProps<T>, 'data' | 'description' | 'onClick' | 'classes'> & {
    title: string;
    primary: string;
    overline?: string;
    fetching?: boolean;
    onRemove?: () => void;
};

const LoadingSkeleton = (
    <React.Fragment>
        <Skeleton variant="text" width={120} />
        <Skeleton variant="text" width={'75%'} height={30} style={{ marginTop: 8 }} />
        <br />
        <Skeleton variant="text" width={'100%'} />
        <Skeleton variant="text" width={'95%'} />
        <Skeleton variant="text" width={'70%'} />
    </React.Fragment>
);

function ActionNotice<T>(
    { primary, title, overline, description, fetching, onRemove, ...props }: ActionNoticeProps<T>,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    return (
        <Container maxWidth="sm" style={{ marginTop: 16 }}>
            {fetching ? LoadingSkeleton : <TextInfoContent overline={overline} heading={title} body={description} />}
            <Container>
                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end" marginTop={2}>
                    {!fetching && (
                        <RemoveButtom
                            ref={ref}
                            index={0}
                            onRemove={onRemove ?? (() => null)}
                            disabled={fetching}
                            variant="outlined"
                            direction="horizontal"
                            description="Press it to confirm action"
                            {...props}
                        >
                            {primary}
                        </RemoveButtom>
                    )}
                </Box>
            </Container>
        </Container>
    );
}

export default React.forwardRef(ActionNotice);
