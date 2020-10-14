import React, { useState, FormEvent } from 'react';
import { doUploadImage, checkExtension } from './upload-image';
import moment from 'moment';
import { AgenteDTO } from '@access-control/agentes';
import { agenteCreateUpdate, agenteSync } from './agente-api';
import { EuiForm, EuiFormRow, EuiFieldText, EuiSuperSelect, EuiDatePicker, EuiFilePicker, EuiImage, EuiSpacer, EuiButton } from '@elastic/eui';
import { environment } from '../environments/environment';

const agenteDefault = {
    nombre: '',
    documento: '',
    genero: 'masculino',
    fechaNacimiento: moment(),
    legacy: '',
    foto: null,
}

function getLegacy(agente) {
    if (!agente) {
        return '';
    }
    const legacy: string = agente.identificadores && agente.identificadores.length > 0 && agente.identificadores[0];
    return legacy && legacy.substr(12)
}

export function AgentesForm(props) {
    const { agente = agenteDefault, done } = props;

    const [foto, isUploading, uploadFoto, setFoto] = doUploadImage(agente.foto);
    const [nombre, setNombre] = useState(agente.nombre);
    const [documento, setDocumento] = useState(agente.documento);
    const [genero, setGenero] = useState(agente.genero);
    const [fechaNacimiento, setFechaNacimiento] = useState(moment(agente.fechaNacimiento));
    const [legacy, setLegacy] = useState(getLegacy(agente));

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
        const agenteDTO: AgenteDTO = {
            id: agente && agente.id,
            nombre: nombre,
            fechaNacimiento: fechaNacimiento.startOf('day').toDate(),
            genero: genero,
            documento: documento,
            active: true,
            foto: foto.id,
            devices: [],
            identificadores: legacy.length > 0 ? ['rrhh-legacy|' + legacy] : [],
            tags: ['fichada']
        }
        agenteCreateUpdate(agenteDTO).then((data) => {
            return agenteSync(agenteDTO);
        }).then(() => {
            done && done();
        });
    }

    return (
        <EuiForm component="form" onSubmit={onSubmit}>
            <EuiFormRow label="Nombre" >
                <EuiFieldText
                    name="nombre"
                    value={nombre}
                    onChange={value => onChange(value, setNombre)}
                    disabled={agente.id}
                />
            </EuiFormRow>

            <EuiFormRow label="Documento" >
                <EuiFieldText
                    name="documento"
                    value={documento}
                    onChange={value => onChange(value, setDocumento)}
                    disabled={agente.id}
                />
            </EuiFormRow>

            <EuiFormRow label="Genero" >
                <EuiSuperSelect
                    options={options}
                    valueOfSelected={genero}
                    onChange={value => onChange(value, setGenero)}
                    itemLayoutAlign="top"
                    hasDividers
                    disabled={agente.id}
                />
            </EuiFormRow>

            <EuiFormRow label="Fecha de nacimiento">
                <EuiDatePicker
                    selected={fechaNacimiento}
                    onChange={value => onChange(value, setFechaNacimiento)}
                    disabled={agente.id}
                />
            </EuiFormRow>

            <EuiFormRow label="Legacy Code" >
                <EuiFieldText
                    name="legacy"
                    value={legacy}
                    onChange={value => onChange(value, setLegacy)}
                    disabled={agente.id}
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

    )
}