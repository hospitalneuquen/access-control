import React, { useState, useEffect } from 'react'
import { EuiPage, EuiPageSideBar, EuiPageBody, EuiPageHeader, EuiPageHeaderSection, EuiTitle, EuiPageContent, EuiPageContentHeader, EuiPageContentHeaderSection, EuiPageContentBody, EuiFlexItem, EuiCard, EuiIcon, EuiFlexGroup, EuiBadge, EuiButton, EuiBetaBadge, EuiFlyout, EuiFlyoutHeader, EuiFlyoutBody, EuiLoadingContent } from '@elastic/eui'
import { environment } from '../environments/environment';
import { Route, useHistory, useLocation } from 'react-router-dom';
import { DeviceItemCard } from './device-item-card';
import { useGoBack } from '../hooks';
import { Page } from '../components/page';
import { Loading } from '../components/loading';
import { DeviceForm } from './device-form';

export function DevicesPage() {
    const history = useHistory();
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const back = useGoBack()

    useEffect(() => {
        setLoading(true);
        fetch(`${environment.API}api/devices`).then(res => res.json()).then((devices) => {
            setDevices(devices);
            setLoading(false);
        })
    }, [back]);
    return (
        <Page title="Dispositivos">
            <Loading loading={loading}>
                <EuiFlexGroup gutterSize="l">
                    {
                        devices.map((device, index) => (
                            <EuiFlexItem key={index}>
                                <DeviceItemCard device={device} />
                            </EuiFlexItem>
                        ))
                    }
                </EuiFlexGroup>
            </Loading>
            <Route path="/devices/:id">
                <EuiFlyout ownFocus onClose={() => history.goBack()}>
                    <EuiFlyoutHeader hasBorder>
                        <EuiTitle>
                            <h2 > Edición </h2>
                        </EuiTitle>
                    </EuiFlyoutHeader>
                    <EuiFlyoutBody>
                        <DeviceForm />
                    </EuiFlyoutBody>
                </EuiFlyout>
            </Route>
        </Page>
    )
}