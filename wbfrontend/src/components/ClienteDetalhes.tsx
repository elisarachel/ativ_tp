import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ClienteDetalhes: React.FC = () => {
  const { id } = useParams();
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await axios.get(`http://localhost:32832/cliente/${id}`);
        setClient(response.data);
      } catch (error) {
        console.error('Error fetching client:', error);
      }
    };

    fetchClient();
  }, [id]);

  if (!client) return <Typography>Loading...</Typography>;

  return (
    <div>
      <Typography variant="h4">{client.nome}</Typography>
      <Typography variant="body1">Email: {client.email}</Typography>
      <Button component={Link} to={`/atualizar/${id}`} variant="contained" color="primary">
        Atualizar
      </Button>
      <Button component={Link} to={`/excluir/${id}`} variant="contained" color="secondary">
        Excluir
      </Button>
    </div>
  );
};

export default ClienteDetalhes;
