import "@babel/polyfill";
import React, { useEffect, useState } from 'react';
import '@elastic/eui/dist/eui_theme_light.css';

import { Route, Link, Switch } from 'react-router-dom';
import { NavBar } from '../components/nav-bar';
import { HomePage } from '../pages/home';
import { DevicesPage } from '../devices/devices.page';
import { AgentesListPage } from '../agentes/agentes-list.page';
import { AgentesCreatePage, AgentesUpdatePage } from '../agentes/agentes-create.page';
import { AgentesSyncPage } from '../agentes/agentes-sync.page';
import {io } from "socket.io-client";
import { EuiGlobalToastList } from "@elastic/eui";
import { environment } from "../environments/environment";
import { LogsPage } from "../logs/logs.page";
import { SocketServerContext } from "../ws.context";

export const App = () => {
    const [toasts, setToast] = useState([]);
    const [socket, setSocket] = useState(null);
    

    useEffect(() => {
        const socket = io(environment.API);
        socket.on("connect", () => {
            console.log(socket.connected); // true
        });

        socket.on('agente-sync', (args) => {
            const t = createToast(args);
            setToast(prev => [...prev, t]);
        });

        setSocket(socket);

      }, []);

      let toatsID = 0;
      const createToast = (evento) => {
          return {
              id: '' + toatsID++, 
            title: evento.succes ?  'Sincronizacion con exito' : 'Sincronizacion ha fallado',
            color: evento.succes ? 'success' : 'danger',
            iconType: 'aggregate',
            toastLifeTimeMs: 5000,
            text: (
              <p>
                { evento.agente.nombre } se sincronizo en el reloj { evento.device.name }
              </p>
            ),
          }
      }

      const removeToast = removedToast => {
        setToast(toasts.filter(toast => toast.id !== removedToast.id));
      };

    return (
        <SocketServerContext.Provider value={socket}>

            <div>
                <EuiGlobalToastList
        toasts={toasts}
        dismissToast={removeToast}
        toastLifeTimeMs={6000}
        />
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
                        path="/agentes/:id/sync"
                        render={() => <AgentesSyncPage></AgentesSyncPage>}
                    />
                    <Route
                        path="/agentes/:id"
                        render={() => <AgentesUpdatePage></AgentesUpdatePage>}
                    />
                    <Route
                        path="/agentes"
                        render={() => <AgentesListPage />}
                    />

                    <Route
                        path="/logs"
                        render={() => <LogsPage />}
                    />
                </Switch>
            </div>
        </SocketServerContext.Provider>

    );
};

export default App;
