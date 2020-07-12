import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { environment } from '../environments/environment';
import { Loading } from '../components/loading';
import { EuiFieldText } from '@elastic/eui';
import { useForm, Controller } from "react-hook-form";

export function DeviceForm() {
    let { id } = useParams();

    const [device, setDevice] = useState(null);
    const { control, register, handleSubmit, reset } = useForm();

    useEffect(() => {
        fetch(`${environment.API}api/devices/${id}`).then(res => res.json()).then((device) => {
            setDevice(device);
            reset({
                nombre: device.name
            })
        });
    }, [id]);

    const onSubmit = data => console.log(data);
    return (
        <Loading loading={!device}>
            {device ? <form onSubmit={handleSubmit(onSubmit)}>
                {/* <Controller
                    as={EuiFieldText}
                    name="name"
                    control={control}
                /> */}
                <EuiFieldText
                    name="nombre"
                    inputRef={register}
                    placeholder="Nombre de HOST"
                />
                {/* <input name="nombre" ref={register({ required: "This is required." })} /> */}
                <input type="submit" />
            </form> : ''
            }
        </Loading>
    );
}