import React from 'react'
import { EuiHeader, EuiHeaderSectionItem, EuiHeaderLogo, EuiHeaderLinks, EuiHeaderLink } from '@elastic/eui'
import { useRouteMatch, useLocation } from 'react-router-dom';

export const NavBar = () => {
    const location = useLocation();
    const isDevicesActive = location.pathname.startsWith('/devices');
    const isAgentesActive = location.pathname.startsWith('/agentes');
    return (
        <EuiHeader >
            <EuiHeaderSectionItem border="right">
                <EuiHeaderLogo href="#" iconType="logoCode">Access Control</EuiHeaderLogo>
            </EuiHeaderSectionItem>

            <EuiHeaderSectionItem>
                <EuiHeaderLinks aria-label="App navigation links example">
                    <EuiHeaderLink href="/devices" isActive={isDevicesActive}  >
                        Dispositivos
                    </EuiHeaderLink>
                    <EuiHeaderLink href="/agentes" isActive={isAgentesActive}>
                        Agentes
                    </EuiHeaderLink>
                </EuiHeaderLinks>
            </EuiHeaderSectionItem>
        </EuiHeader>
    )
}