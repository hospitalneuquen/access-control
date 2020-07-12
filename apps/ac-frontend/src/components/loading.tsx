import React from 'react';
import { EuiLoadingContent } from '@elastic/eui';

export interface LoadingPros {
    loading: boolean;
    lines?: number
    children: any;
}
export function Loading(props: LoadingPros) {
    const { loading, children, lines = 5 } = props;
    return (
        loading
            ? <EuiLoadingContent lines={lines as any} />
            : children
    );
}