import React from 'react';
import { EuiCard, EuiIcon, EuiBetaBadge, EuiFlexGroup, EuiFlexItem, EuiButton } from '@elastic/eui';
import { useHistory } from 'react-router-dom';

export function DeviceItemCard({ device }) {
    const history = useHistory();
    const navigateTo = (device) => {
        history.push(`/devices/${device.id}`);
    }

    return (
        <EuiCard
            title={device.name}
            description={device.description}
            icon={<EuiIcon size="xxl" type="watchesApp" />}
            children={
                <div>
                    {
                        device.tags.map((t) => <EuiBetaBadge key={t} label={t}></EuiBetaBadge>)
                    }

                </div>
            }
            footer={
                <EuiFlexGroup justifyContent="flexEnd">
                    <EuiFlexItem grow={false}>
                        <EuiButton iconType="documentEdit" onClick={() => navigateTo(device)}>Edit</EuiButton>
                    </EuiFlexItem>
                </EuiFlexGroup>
            }
        />
    )
}