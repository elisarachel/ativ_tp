import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, MenuItem, Menu, ListItemButton, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from '@mui/material';

function withMobile(Component: React.ComponentType<any>) {
    return function WrappedComponent(props: any) {
        const theme = useTheme();
        const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
        const navigate = useNavigate();
        return <Component {...props} isMobile={isMobile} navigate={navigate} />;
    }
}


type Botao = {
    nome: string;
    link?: string;
    dropdown?: Botao[];
};

type Props = {
    tema: string;
    botoes: Botao[];
    seletorView: (valor: string) => void;
	isMobile?: boolean;
	navigate: (path: string) => void; // Add this line
};


type State = {
    drawerOpen: boolean;
    anchorEl: HTMLElement | null;
};

class BarraNavegacao extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            drawerOpen: false,
            anchorEl: null
        };
    }

    toggleDrawer = () => {
        this.setState({ drawerOpen: !this.state.drawerOpen });
    };

    handleListItemClick = (nome: string, link?: string, isDropdown?: boolean) => {
        this.props.seletorView(nome);
        if (!isDropdown) {
            this.setState({ drawerOpen: false });
        }
        if (link) {
            this.props.navigate(link);
        }
    };

	handleMobileMenuItemClick = (nome: string, link?: string) => {
        this.props.seletorView(nome);
        this.setState({ drawerOpen: false });
        if (link) {
            this.props.navigate(link);
        }
    };


    handleMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleMenuClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
		const { tema, botoes, isMobile } = this.props; // Destructure isMobile from props
        const { drawerOpen, anchorEl } = this.state;


        return (
            <>
                <AppBar position="static" className={tema}>
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>WB</Typography>
						{isMobile && (
                        <IconButton edge="end" color="inherit" aria-label="menu" onClick={this.toggleDrawer}>
                            <MenuIcon />
                        </IconButton>
						)}
						{!isMobile && (
                        <Box sx={{ display: 'flex' }}>
                            {botoes.map((botao, index) => (
                                (botao.dropdown && (
                                    <div key={index}>
                                        <ListItem>
                                            <ListItemButton
                                                aria-controls="cadastros-menu"
                                                aria-haspopup="true"
                                                onClick={(event) => {
                                                    this.handleMenuOpen(event);
                                                    this.handleListItemClick(botao.nome, undefined, true);
                                                }}
                                            >
                                                <ListItemText primary={botao.nome} />
                                            </ListItemButton>
                                        </ListItem>
                                        <Menu
                                            id="cadastros-menu"
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={this.handleMenuClose}
                                        >
                                            {botao.dropdown.map((dropdownItem, dropdownIndex) => (
                                                <MenuItem key={dropdownIndex} onClick={() => this.handleListItemClick(dropdownItem.nome, dropdownItem.link)}>
                                                    {dropdownItem.nome}
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </div>
                                )) || (
                                    <Link key={index} to={botao.link || '/'} style={{ textDecoration: "none", color: "inherit" }}>
                                        <ListItem button onClick={() => this.handleListItemClick(botao.nome)} sx={{ py: 2 }}>
                                            <ListItemText primary={botao.nome} />
                                        </ListItem>
                                    </Link>
                                )
                            ))}
                        </Box>
						)}
                    </Toolbar>
                </AppBar>
                <Drawer anchor="left" open={drawerOpen} onClose={this.toggleDrawer}>
                    <List>
                        {botoes.map((botao, index) => (
                            (botao.dropdown && (
                                <ListItem key={index} button onClick={() => this.setState({ drawerOpen: true })}>
                                    <ListItemText primary={botao.nome} />
                                    <List component="div" disablePadding>
                                        {botao.dropdown.map((dropdownItem, dropdownIndex) => (
                                            <ListItem 
                                                key={dropdownIndex} 
                                                button 
                                                onClick={() => this.handleMobileMenuItemClick(dropdownItem.nome, dropdownItem.link)}
                                            >
                                                <ListItemText primary={dropdownItem.nome} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </ListItem>
                            )) || (
                                <Link key={index} to={botao.link || '/'} style={{ textDecoration: "none", color: "inherit" }}>
                                    <ListItem button onClick={() => this.handleListItemClick(botao.nome)}>
                                        <ListItemText primary={botao.nome} />
                                    </ListItem>
                                </Link>
                            )
                        ))}
                    </List>
                </Drawer>
            </>
        );
    }
}

export default withMobile(BarraNavegacao);

