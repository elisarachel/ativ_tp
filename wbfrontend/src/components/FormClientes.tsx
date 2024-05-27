import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Box, Typography } from '@mui/material';

interface FormClientesProps {
  onSubmitSuccess?: () => void;
}

const FormClientes: React.FC<FormClientesProps> = ({ onSubmitSuccess }) => {
  const { id } = useParams<{ id: string }>();
  const [clienteData, setClienteData] = useState<any>({
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

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchClient = async () => {
        try {
          const response = await axios.get(`http://localhost:32832/cliente/${id}`);
          setClienteData(response.data);
        } catch (error) {
          console.error('Error fetching client:', error);
        }
      };
      fetchClient();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setClienteData((prevData: any) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setClienteData((prevData: any) => ({
      ...prevData,
      endereco: {
        ...prevData.endereco,
        [name]: value
      }
    }));
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number): void => {
    const { name, value } = e.target;
    setClienteData((prevData: any) => ({
      ...prevData,
      telefones: prevData.telefones.map((telefone: any, i: number) =>
        i === index ? { ...telefone, [name]: value } : telefone
      )
    }));
  };

  const handleAddTelefone = (): void => {
    setClienteData((prevData: any) => ({
      ...prevData,
      telefones: [...prevData.telefones, { ddd: '', numero: '' }]
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:32832/cliente/atualizar`, clienteData);
      } else {
        await axios.post('http://localhost:32832/cliente/cadastrar', clienteData);
      }
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
      onSubmitSuccess && onSubmitSuccess();
      navigate('/');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Box component="form" sx={{ p: 4 }} onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>{id ? 'Atualizar Cliente' : 'Cadastro de Cliente'}</Typography>
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
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Bairro"
            name="bairro"
            value={clienteData.endereco.bairro}
            onChange={handleEnderecoChange}
          />
        </Grid>
        <Grid item xs={12}>
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
          />
        </Grid>
        {clienteData.telefones.map((telefone: any, index: number) => (
          <React.Fragment key={index}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="DDD"
                name="ddd"
                value={telefone.ddd}
                onChange={(e) => handleTelefoneChange(e, index)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Número"
                name="numero"
                value={telefone.numero}
                onChange={(e) => handleTelefoneChange(e, index)}
              />
            </Grid>
          </React.Fragment>
        ))}
        <Grid item xs={12}>
          <Button variant="outlined" onClick={handleAddTelefone}>Adicionar Telefone</Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">{id ? 'Atualizar' : 'Cadastrar'}</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FormClientes;
