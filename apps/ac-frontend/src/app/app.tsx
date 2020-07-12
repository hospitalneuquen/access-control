import "@babel/polyfill";
import React from 'react';
import '@elastic/eui/dist/eui_theme_light.css';

import { Route, Link } from 'react-router-dom';
import { NavBar } from '../components/nav-bar';
import { HomePage } from '../pages/home';
import { DevicesPage } from '../devices/devices.page';

export const App = () => {
    return (
        <div>
            <NavBar />
            <Route
                path="/"
                exact
                render={HomePage}
            />
            <Route
                path="/devices"
                render={() => <DevicesPage></DevicesPage>}
            />
        </div>
    );
};

export default App;
