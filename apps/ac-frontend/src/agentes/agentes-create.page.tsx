import React, { useState, FormEvent } from 'react';
import { Page } from '../components/page';
import { EuiForm, EuiFormRow, EuiFieldText, EuiSuperSelect, EuiDatePicker, EuiFilePicker, EuiImage, EuiSpacer, EuiButton } from '@elastic/eui';
import moment from 'moment';
import { checkExtension, doUploadImage } from './upload-image';
import { environment } from '../environments/environment';
import { AgenteDTO } from '@access-control/agentes';
import { agenteCreate } from './agente-api';
import { useHistory } from 'react-router-dom';

export function AgentesCreatePage() {
    const history = useHistory();

    const [foto, isUploading, uploadFoto, setFoto] = doUploadImage();

    const [nombre, setNombre] = useState('');
    const [documento, setDocumento] = useState('');
    const [genero, setGenero] = useState('masculino');
    const [fechaNacimiento, setFechaNacimiento] = useState(moment());
    const [legacy, setLegacy] = useState('');

    const onChange = (value, setter) => {
        if (value.target) {
            setter(value.target.value);
        } else {
            setter(value);
        }
    };

    const onChangeFile = (value: FileList) => {
        if (value.length > 0) {
            const file = value.item(0);
            if (checkExtension(file)) {
                uploadFoto(file);
            }
        } else {
            setFoto(null);
        }
    };



    const options = [
        {
            value: 'masculino',
            inputDisplay: 'Masculino',

        },
        {
            value: 'femenino',
            inputDisplay: 'Femenino',

        },

    ];

    const onSubmit = (event: FormEvent) => {
        // [TODO] Validation
        event.preventDefault();
        const agente: AgenteDTO = {
            nombre: nombre,
            fechaNacimiento: fechaNacimiento.startOf('day').toDate(),
            genero: genero,
            documento: documento,
            active: true,
            foto: foto.id,
            devices: [],
            identificadores: legacy.length > 0 ? ['rrhh-legacy|' + legacy] : []
        }
        agenteCreate(agente).then((data) => {
            history.replace('/agentes');
        });
    }

    return (
        <Page title="Nuevo Agente">
            <EuiForm component="form" onSubmit={onSubmit}>
                <EuiFormRow label="Nombre" >
                    <EuiFieldText
                        name="nombre"
                        value={nombre}
                        onChange={value => onChange(value, setNombre)}
                    />
                </EuiFormRow>
                <EuiFormRow label="Documento" >
                    <EuiFieldText
                        name="documento"
                        value={documento}
                        onChange={value => onChange(value, setDocumento)}
                    />
                </EuiFormRow>
                <EuiFormRow label="Genero" >
                    <EuiSuperSelect
                        options={options}
                        valueOfSelected={genero}
                        onChange={value => onChange(value, setGenero)}
                        itemLayoutAlign="top"
                        hasDividers
                    />
                </EuiFormRow>
                <EuiFormRow label="Fecha de nacimiento">
                    <EuiDatePicker
                        selected={fechaNacimiento}
                        onChange={value => onChange(value, setFechaNacimiento)}
                    />
                </EuiFormRow>
                <EuiFormRow label="Legacy Code" >
                    <EuiFieldText
                        name="legacy"
                        value={legacy}
                        onChange={value => onChange(value, setLegacy)}
                    />
                </EuiFormRow>
                <EuiFormRow label="Foto" >
                    <EuiFilePicker
                        id="asdf2"
                        initialPromptText="Select or drag and drop multiple files"
                        onChange={files => {
                            onChangeFile(files);
                        }}
                        display="default"
                        aria-label="Use aria labels when no actual label is in use"
                        isLoading={isUploading}
                    />
                </EuiFormRow>
                {
                    foto ?
                        <EuiFormRow>
                            <EuiImage
                                allowFullScreen
                                alt="foto del agente"
                                url={environment.API + 'api/images/' + foto.id}
                            />
                        </EuiFormRow> : null
                }

                <EuiSpacer />

                <EuiButton type="submit" fill>
                    GRABAR
                </EuiButton>

            </EuiForm>
        </Page>

    )
}
