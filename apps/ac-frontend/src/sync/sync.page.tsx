import React from 'react';
import { EuiFlexGroup } from '@elastic/eui';
import { SyncForm } from './sync-form';
import { Page } from '../components/page';

export function SyncPage() {
    return (
        <Page title="Sincronización">
            <EuiFlexGroup gutterSize="l">
                <SyncForm />
            </EuiFlexGroup>
        </Page>
    );
}
