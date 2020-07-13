import React from 'react';
import { EuiPage, EuiPageBody, EuiPageContent, EuiPageContentHeader, EuiPageContentHeaderSection, EuiTitle, EuiPageContentBody, EuiLoadingContent, EuiFlexGroup, EuiFlexItem, EuiFlyout, EuiFlyoutHeader, EuiFlyoutBody } from '@elastic/eui';

export interface PageProps {
    title?: string;
    children: any;
    action?: any;
}
export function Page(props: PageProps) {
    const { title, action, children } = props;

    return (
        <EuiPage>
            <EuiPageBody component="div" style={{ height: "90vh" }}>
                <EuiPageContent>
                    {title ?
                        <EuiPageContentHeader>
                            <EuiPageContentHeaderSection>
                                <EuiTitle>
                                    <h2>{title}</h2>
                                </EuiTitle>
                            </EuiPageContentHeaderSection>
                            {
                                action ? (
                                    <EuiPageContentHeaderSection>
                                        {action}
                                    </EuiPageContentHeaderSection>
                                ) : null
                            }
                        </EuiPageContentHeader>
                        : null
                    }
                    <EuiPageContentBody>
                        {
                            children
                        }
                    </EuiPageContentBody>
                </EuiPageContent>
            </EuiPageBody>
        </EuiPage>
    )
}