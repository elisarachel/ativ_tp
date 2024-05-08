import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme, Box, MenuItem, Menu, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type Botao = {
    nome: string;
    link?: string;
    dropdown?: Botao[];
};

type Props = {
    tema: string;
    botoes: Botao[];
    seletorView: (valor: string) => void;
};

export default function BarraNavegacao(props: Props) {
    const { tema, botoes, seletorView } = props;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

	const handleListItemClick = (nome: string, link?: string, isDropdown?: boolean) => {
		seletorView(nome);
		if (!isDropdown) {
			setDrawerOpen(false);
		}
		if (link) {
			navigate(link);
		}
	};

	const handleMobileMenuItemClick = (nome: string, link?: string) => {
        seletorView(nome);
        setDrawerOpen(false);
        if (link) {
            navigate(link);
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
		setAnchorEl(event.currentTarget);
	};

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <AppBar position="static" className={tema}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>WB</Typography>
                    {isMobile ? (
					<IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleDrawer}>
						<MenuIcon />
					</IconButton>
				) : (
					<Box sx={{ display: 'flex' }}>
						{botoes.map((botao, index) => (
							botao.dropdown ? (
								<div key={index}>
									<ListItem>
										<ListItemButton
											aria-controls="cadastros-menu"
											aria-haspopup="true"
											onClick={(event) => {
												handleMenuOpen(event);
												handleListItemClick(botao.nome, undefined, true);
											}}
										>
											<ListItemText primary={botao.nome} />
										</ListItemButton>
									</ListItem>
									<Menu
										id="cadastros-menu"
										anchorEl={anchorEl}
										open={Boolean(anchorEl)}
										onClose={handleMenuClose}
									>
										{botao.dropdown.map((dropdownItem, dropdownIndex) => (
											<MenuItem key={dropdownIndex} onClick={() => handleListItemClick(dropdownItem.nome, dropdownItem.link)}>
												{dropdownItem.nome}
											</MenuItem>
										))}
									</Menu>
								</div>
							) : (
								<Link key={index} to={botao.link || '/'} style={{ textDecoration: "none", color: "inherit" }}>
									<ListItem button onClick={() => handleListItemClick(botao.nome)} sx={{ py: 2 }}>
										<ListItemText primary={botao.nome} />
									</ListItem>
								</Link>
							)
						))}
					</Box>
				)}

                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                <List>
                    {botoes.map((botao, index) => (
                        botao.dropdown && isMobile ? (
                            <ListItem key={index} button onClick={() => setDrawerOpen(true)}>
                                <ListItemText primary={botao.nome} />
                                <List component="div" disablePadding>
                                    {botao.dropdown.map((dropdownItem, dropdownIndex) => (
                                        <ListItem 
                                            key={dropdownIndex} 
                                            button 
                                            onClick={() => handleMobileMenuItemClick(dropdownItem.nome, dropdownItem.link)}
                                        >
                                            <ListItemText primary={dropdownItem.nome} />
                                        </ListItem>
                                    ))}
                                </List>
                            </ListItem>
                        ) : (
                            <Link key={index} to={botao.link || '/'} style={{ textDecoration: "none", color: "inherit" }}>
                                <ListItem button onClick={() => handleListItemClick(botao.nome)}>
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
