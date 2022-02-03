import React, { useContext, useEffect, useState } from 'react' 
import {  useHistory,   } from 'react-router-dom'; 
import { useGoBack } from '../hooks';
import { Page } from '../components/page'; 
import { SocketServerContext } from '../ws.context';

export function LogsPage() {
    const history = useHistory();
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const back = useGoBack()
 
    const socket = useContext(SocketServerContext);

    const [mensajes, setMensajes] = useState([]);


    useEffect(() => {
        if (socket) {
            socket.on('logs', (args) => {
                console.log('mensajes', args) 
                setMensajes(oldArray => [...oldArray, args]);
            });
        }
    }, [socket])

    return (
        <Page title="Logs">
             {mensajes.map((m, i) => {
                 return <div key={i}> { m }  </div>
             }) }
            
        </Page>
    )
}