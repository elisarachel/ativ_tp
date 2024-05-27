import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button } from '@mui/material';

const ExcluirCliente: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const excluirCliente = async () => {
      try {
        await axios.delete(`http://localhost:32832/cliente/excluir`, { data: { id } });
        navigate('/');
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    };

    excluirCliente();
  }, [id, navigate]);

  return (
    <div>
      <Typography variant="h4">Excluindo Cliente</Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/')}>
        Voltar
      </Button>
    </div>
  );
};

export default ExcluirCliente;
