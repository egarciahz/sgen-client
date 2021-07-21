import React, { CSSProperties } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

type CustomScrollProps = {
    style: CSSProperties;
    children: React.ReactElement;
    onScroll: (params: any) => void;
};

export default React.forwardRef(function CustomScroll({ style, ...props }: CustomScrollProps, ref: any) {
    return (
        <Scrollbars
            ref={ref}
            style={{
                ...style,
                overflow: 'hidden',
            }}
            autoHide
            {...props}
        />
    );
});
