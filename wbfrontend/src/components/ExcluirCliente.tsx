import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button, Box } from '@mui/material';

const ExcluirCliente: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      // Fetch the client data first
      const response = await axios.get(`http://localhost:32832/cliente/${id}`);
      const client = response.data;

      // Send delete request with client data in the body
      await axios.delete('http://localhost:32832/cliente/excluir', { data: client });
      navigate('/');
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Excluir Cliente</Typography>
      <Typography variant="body1" gutterBottom>Tem certeza que deseja excluir este cliente?</Typography>
      <Button variant="contained" color="secondary" onClick={handleDelete}>Excluir</Button>
    </Box>
  );
};

export default ExcluirCliente;
