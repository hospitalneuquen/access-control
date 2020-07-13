import "@babel/polyfill";
import React from 'react';
import '@elastic/eui/dist/eui_theme_light.css';

import { Route, Link, Switch } from 'react-router-dom';
import { NavBar } from '../components/nav-bar';
import { HomePage } from '../pages/home';
import { DevicesPage } from '../devices/devices.page';
import { AgentesListPage } from '../agentes/agentes-list.page';
import { AgentesCreatePage } from '../agentes/agentes-create.page';

export const App = () => {
    return (
        <div>
            <NavBar />

            <Switch>
                <Route
                    path="/"
                    exact
                    render={HomePage}
                />
                <Route
                    path="/devices"
                    render={() => <DevicesPage />}
                />
                <Route
                    path="/agentes/create"
                    render={() => <AgentesCreatePage></AgentesCreatePage>}
                />
                <Route
                    path="/agentes"
                    render={() => <AgentesListPage />}
                />
            </Switch>
        </div>
    );
};

export default App;
