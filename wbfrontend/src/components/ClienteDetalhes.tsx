import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button, Box, List, ListItem, ListItemText } from '@mui/material';

const ClienteDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>{`${client.nome} ${client.sobreNome}`}</Typography>
      <Typography variant="body1" gutterBottom>Email: {client.email}</Typography>
      <Typography variant="h6" gutterBottom>Endereço:</Typography>
      <List>
        <ListItem>
          <ListItemText primary="Estado" secondary={client.endereco.estado} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Cidade" secondary={client.endereco.cidade} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Bairro" secondary={client.endereco.bairro} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Rua" secondary={client.endereco.rua} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Número" secondary={client.endereco.numero} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Código Postal" secondary={client.endereco.codigoPostal} />
        </ListItem>
        {client.endereco.informacoesAdicionais && (
          <ListItem>
            <ListItemText primary="Informações Adicionais" secondary={client.endereco.informacoesAdicionais} />
          </ListItem>
        )}
      </List>

      <Typography variant="h6" gutterBottom>Telefones:</Typography>
      <List>
        {client.telefones.map((telefone: any, index: number) => (
          <ListItem key={index}>
            <ListItemText primary={`Telefone ${index + 1}`} secondary={`${telefone.ddd}-${telefone.numero}`} />
          </ListItem>
        ))}
      </List>

      <Button component={Link} to={`/atualizar/${id}`} variant="contained" color="primary" sx={{ mt: 2, mr: 2 }}>
        Atualizar
      </Button>
      <Button component={Link} to={`/excluir/${id}`} variant="contained" color="secondary" sx={{ mt: 2 }}>
        Excluir
      </Button>
    </Box>
  );
};

export default ClienteDetalhes;
