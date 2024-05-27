import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navbar from './components/Navbar';
import ListaClientes from './components/ListaClientes';
import ClienteDetalhes from './components/ClienteDetalhes';
import FormClientes from './components/FormClientes';
import ExcluirCliente from './components/ExcluirCliente';

const theme = createTheme({
  palette: {
    primary: {
      main: '#c0adea',
    },
    text: {
      primary: '#515151'
    }
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ListaClientes />} />
          <Route path="/cliente/:id" element={<ClienteDetalhes />} />
          <Route path="/cadastrar" element={<FormClientes onSubmitSuccess={() => console.log('Form submitted successfully')} />
} />
          <Route path="/atualizar/:id" element={<FormClientes onSubmitSuccess={() => console.log('Form submitted successfully')} />
} />
          <Route path="/excluir/:id" element={<ExcluirCliente />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
