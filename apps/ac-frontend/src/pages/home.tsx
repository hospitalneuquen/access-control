import { EuiPage, EuiPageSideBar, EuiPageBody, EuiPageHeader, EuiPageHeaderSection, EuiTitle, EuiPageContent, EuiPageContentHeader, EuiPageContentHeaderSection, EuiPageContentBody } from '@elastic/eui'
import React from 'react'

export const HomePage = () => {

    return (
        <EuiPage>
            <EuiPageBody component="div" style={{ height: "90vh" }}>
                <EuiPageContent>
                    <EuiPageContentHeader>
                        <EuiPageContentHeaderSection>
                            <EuiTitle>
                                <h2>Bienvenido a Access Control - Hospital Provincial Neuquen</h2>
                            </EuiTitle>
                        </EuiPageContentHeaderSection>
                        {/* <EuiPageContentHeaderSection>
                            Content abilities
                        </EuiPageContentHeaderSection> */}
                    </EuiPageContentHeader>
                    <EuiPageContentBody>Content body</EuiPageContentBody>
                </EuiPageContent>
            </EuiPageBody>
        </EuiPage>
    )
}