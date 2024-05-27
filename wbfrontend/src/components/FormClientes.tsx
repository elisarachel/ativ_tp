import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Box, Typography } from '@mui/material';

interface FormClientesProps {
  onSubmitSuccess: () => void;
}

const FormClientes: React.FC<FormClientesProps> = ({ onSubmitSuccess }) => {
  const [clienteData, setClienteData] = useState({
    nome: '',
    sobreNome: '',
    email: '',
    endereco: {
      estado: '',
      cidade: '',
      bairro: '',
      rua: '',
      numero: '',
      codigoPostal: '',
      informacoesAdicionais: ''
    },
    telefones: [{
      ddd: '',
      numero: ''
    }]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setClienteData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setClienteData(prevData => ({
      ...prevData,
      endereco: {
        ...prevData.endereco,
        [name]: value
      }
    }));
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number): void => {
    const { name, value } = e.target;
    const key = name.slice(0, -1); // Remove the index from the end of the name
    setClienteData(prevData => ({
      ...prevData,
      telefones: prevData.telefones.map((telefone, i) =>
        i === index ? { ...telefone, [key]: value } : telefone
      )
    }));
  };

  const handleAddTelefone = (): void => {
    setClienteData(prevData => ({
      ...prevData,
      telefones: [...prevData.telefones, { ddd: '', numero: '' }]
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:32832/cliente/cadastrar', clienteData);
      setClienteData({
        nome: '',
        sobreNome: '',
        email: '',
        endereco: {
          estado: '',
          cidade: '',
          bairro: '',
          rua: '',
          numero: '',
          codigoPostal: '',
          informacoesAdicionais: ''
        },
        telefones: [{
          ddd: '',
          numero: ''
        }]
      });
      onSubmitSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Box component="form" sx={{ p: 4 }} onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>Cadastro de Cliente</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Nome"
            name="nome"
            value={clienteData.nome}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Sobrenome"
            name="sobreNome"
            value={clienteData.sobreNome}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={clienteData.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Estado"
            name="estado"
            value={clienteData.endereco.estado}
            onChange={handleEnderecoChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Cidade"
            name="cidade"
            value={clienteData.endereco.cidade}
            onChange={handleEnderecoChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Bairro"
            name="bairro"
            value={clienteData.endereco.bairro}
            onChange={handleEnderecoChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Rua"
            name="rua"
            value={clienteData.endereco.rua}
            onChange={handleEnderecoChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Número"
            name="numero"
            value={clienteData.endereco.numero}
            onChange={handleEnderecoChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Código Postal"
            name="codigoPostal"
            value={clienteData.endereco.codigoPostal}
            onChange={handleEnderecoChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Informações Adicionais"
            name="informacoesAdicionais"
            value={clienteData.endereco.informacoesAdicionais}
            onChange={handleEnderecoChange}
            multiline
            rows={4}
          />
        </Grid>
        {clienteData.telefones.map((telefone, index) => (
          <React.Fragment key={index}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label={`DDD ${index + 1}`}
                name={`ddd${index}`}
                value={telefone.ddd}
                onChange={(e) => handleTelefoneChange(e, index)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label={`Número ${index + 1}`}
                name={`numero${index}`}
                value={telefone.numero}
                onChange={(e) => handleTelefoneChange(e, index)}
              />
            </Grid>
          </React.Fragment>
        ))}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleAddTelefone}>
            Adicionar Telefone
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Enviar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FormClientes;
