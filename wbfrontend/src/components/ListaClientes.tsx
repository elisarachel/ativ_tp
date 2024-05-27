import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';

const ListaClientes: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:32832/clientes');
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setError('Error fetching clients. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom sx={{ margin: 2 }}>
        Lista de Clientes
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography variant="body1" color="error">{error}</Typography>
      ) : (
        <List>
          {clients.map((client) => (
            <ListItem key={client.id} component={Link} to={`/cliente/${client.id}`}>
              <ListItemText
                primary={`${client.nome} ${client.sobreNome}`}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textPrimary">
                      Email: {client.email ?? 'N/A'}<br />
                      Endereço: {`${client.endereco.rua}, ${client.endereco.numero}, ${client.endereco.bairro}, ${client.endereco.cidade}, ${client.endereco.estado}, ${client.endereco.codigoPostal}`}<br />
                      Telefones: {client.telefones.map((telefone: any) => `${telefone.ddd}-${telefone.numero}`).join(', ')}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default ListaClientes;
