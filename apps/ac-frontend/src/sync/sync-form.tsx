import React, { useState, FormEvent } from 'react';
import { EuiDatePicker, EuiFormRow, EuiButton, EuiComboBox, EuiGlobalToastList } from '@elastic/eui';
import { useFetchAgentes } from '../agentes/agente-api';
import { AgenteDTO } from '@access-control/agentes';
import { Toast } from '@elastic/eui/src/components/toast/global_toast_list';
import { syncClocks } from './sync-api';
import { useHistory } from 'react-router-dom';

export function SyncForm() {
  const [formData, setFormData] = useState({ fromDate: null, toDate: null, selectedAgents: [] });
  const [search, setSearch] = useState('');
  const [messages, setMessages] = useState<Toast[]>([]);
  const history = useHistory();
  const { data } = useFetchAgentes(search);
  const agentes = data as AgenteDTO[];

  const onChange = (value: any, key: string) => {
    const newData = { ...formData };
    newData[key] = value.target ? value.target.value : value;
    setFormData(newData);
  };

  const removeToast = (removedToast: Toast) => {
    setMessages(messages.filter((toast) => toast.title != removedToast.title));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!!formData.fromDate && !!formData.toDate) {
      syncClocks(
        formData.fromDate,
        formData.toDate,
        formData.selectedAgents.map((agent) => agent.key)
      )
        .then((_) => {
          setMessages([
            {
              title: 'Sincronizando',
              color: 'primary',
              text: <>Sincronización iniciada (este proceso puede demorar varios minutos)</>
            } as Toast
          ]);
          setTimeout(() => history.push(`/logs`), 3000);
        })
        .catch((e) => {
          setMessages([
            {
              title: 'Error en la sincronización',
              color: 'danger',
              text: <>{JSON.stringify(e)}</>
            } as Toast
          ]);
        });
    } else {
      setMessages([
        ...messages,
        { title: 'Faltan datos', color: 'danger', text: <>Desde y hasta son obligatorios</> } as Toast
      ]);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <EuiFormRow label="Desde">
        <EuiDatePicker
          name="fromDate"
          selected={formData.fromDate}
          onChange={(value) => onChange(value, 'fromDate')}
          isInvalid={!!formData.fromDate === false}
        />
      </EuiFormRow>

      <EuiFormRow label="Hasta">
        <EuiDatePicker
          name="toDate"
          selected={formData.toDate}
          onChange={(value) => onChange(value, 'toDate')}
          isInvalid={!!formData.toDate === false}
        />
      </EuiFormRow>

      <EuiFormRow label="Agentes">
        <EuiComboBox
          key="agentes"
          selectedOptions={formData.selectedAgents}
          onChange={(value) => onChange(value, 'selectedAgents')}
          onSearchChange={setSearch}
          options={
            agentes &&
            Array.isArray(agentes) &&
            agentes.map((item) => ({ key: item.documento, label: item.nombre }))
          }
          fullWidth
        />
      </EuiFormRow>

      <EuiButton type="submit" fill>
        Sincronizar
            </EuiButton>

      <EuiGlobalToastList toasts={messages} dismissToast={removeToast} toastLifeTimeMs={5000} />
    </form>
  );
}
