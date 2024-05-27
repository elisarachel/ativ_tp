import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          World Beauty
        </Typography>
        <Button color="inherit" component={Link} to="/">Listar Clientes</Button>
        <Button color="inherit" component={Link} to="/cadastrar">Cadastrar Cliente</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
