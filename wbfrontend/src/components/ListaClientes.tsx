import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, CircularProgress } from '@mui/material';

const ListaClientes: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async (url: string) => {
      try {
        console.log('Fetching clients...');
        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
          },
          maxRedirects: 0, // Prevent Axios from following redirects for debugging
        });
        console.log('Response data:', response.data);
        setClients(response.data);
      } catch (err: any) {
        console.error('Error fetching clients:', err);
        if (err.response) {
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          console.error('Response headers:', err.response.headers);

          // Handle redirection manually
          if (err.response.status === 302) {
            const redirectUrl = err.response.headers.location;
            console.error('Redirected to:', redirectUrl);
            if (redirectUrl) {
              // Retry the request with the redirected URL
              fetchClients(redirectUrl);
            } else {
              setError('Error fetching clients: Redirected without a location header.');
            }
          } else {
            setError('Error fetching clients. Please try again later.');
          }
        } else if (err.request) {
          console.error('Request made but no response received:', err.request);
          setError('Error fetching clients. Please try again later.');
        } else {
          console.error('Error setting up request:', err.message);
          setError('Error fetching clients. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClients('http://localhost:32832/clientes');
  }, []);

  console.log('Clients state:', clients);
  console.log('Loading state:', loading);
  console.log('Error state:', error);

  return (
    <div>
      <Typography variant="h4" gutterBottom sx={{ marginBottom: 2, marginLeft: 2, marginRight: 2, marginTop: 2 }}>
		Lista de Clientes
		</Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography variant="body1" color="error">{error}</Typography>
      ) : (
        <List>
          {clients.map((client) => (
            <ListItem key={client.id}>
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
