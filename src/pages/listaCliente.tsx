import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, Dialog, Button, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Box } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Produto } from "./listaProdutos";
import { Servico } from "./listaServicos";
import { SelectChangeEvent } from '@mui/material';
import { withTheme, Theme } from '@mui/material/styles';

type Cliente = {
    nome?: string;
    sobrenome?: string;
    telefone?: string;
    email?: string;
    genero: string;
    produtosConsumidos?: Produto[];
    servicosConsumidos?: Servico[];
};

type State = {
    filterOption: string;
    editDialogOpen: boolean;
    deleteDialogOpen: boolean;
    selectedClient: Cliente | null;
	clientes: Cliente[];
};

type FilteredClientsByGender = { gender: string; clients: Cliente[] }[];

class ListaClienteBase extends React.Component<{ clientes: any, tema: Theme; }, State> {
	filteredClients: any;
    constructor(props: { clientes: any, tema: any; }) {
        super(props);
        this.state = {
            filterOption: '',
            editDialogOpen: false,
            deleteDialogOpen: false,
            selectedClient: null,
			clientes: this.props.clientes,
        };
    }

	componentDidMount() {
        this.filteredClients = this.filterClients();
    }

    handleFilterChange = (event: SelectChangeEvent<string>) => {
        this.setState({ filterOption: event.target.value });
    };

    filterClients = (): Cliente[] | FilteredClientsByGender => {
        const { clientes } = this.state;
        const { filterOption } = this.state;

        switch (filterOption) {
            case 'top10Quantidade':
                return this.getTop10ClientesPorQuantidade(true, 10);
            case 'bottom10Quantidade':
                return this.getTop10ClientesPorQuantidade(false, 10);
            case 'maisConsumiramPorValor':
                return this.getTop5ClientesPorValor(true, 5);
            case 'listarPorGenero':
                const clientsByGender: { [key: string]: Cliente[] } = {};
                clientes.forEach((cliente: Cliente) => {
                    const genero = cliente.genero.toString();

                    if (clientsByGender[genero]) {
                        clientsByGender[genero].push(cliente);
                    } else {
                        clientsByGender[genero] = [cliente];
                    }
                });
                const clientsByGenderArray = Object.entries(clientsByGender).map(([gender, clients]) => ({ gender, clients }));
                return clientsByGenderArray;
            default:
                return clientes;
        }
    };

	getTop10ClientesPorQuantidade = (most: boolean, count: number) => {
        const { clientes } = this.state;

		const clientsWithTotalConsumption = clientes.map((client: Cliente) => {
            const totalProductsConsumed = client.produtosConsumidos?.length ?? 0;
            const totalServicesConsumed = client.servicosConsumidos?.length ?? 0;
            return { ...client, totalProductsConsumed, totalServicesConsumed };
        });

        clientsWithTotalConsumption.sort((a, b) => {
            const totalConsumedA = a.totalProductsConsumed + a.totalServicesConsumed;
            const totalConsumedB = b.totalProductsConsumed + b.totalServicesConsumed;
            const diff = totalConsumedA - totalConsumedB;
            return most ? -diff : diff;
        });

        return clientsWithTotalConsumption.slice(0, count);
	};

	getTop5ClientesPorValor = (most: boolean, count: number) => {
		const { clientes } = this.state;

		const clientsWithTotalPrice = clientes.map((client: Cliente) => {
            const totalPriceProducts = client.produtosConsumidos?.reduce((total, produto) => total + produto.preco, 0) ?? 0;
            const totalPriceServices = client.servicosConsumidos?.reduce((total, servico) => total + servico.preco, 0) ?? 0;
            const totalPriceConsumed = totalPriceProducts + totalPriceServices;
            return { ...client, totalPriceConsumed };
        });

        clientsWithTotalPrice.sort((a, b) => {
            const diff = a.totalPriceConsumed - b.totalPriceConsumed;
            return most ? -diff : diff;
        });

        return clientsWithTotalPrice.slice(0, count);
	};

	handleEditClick = (client: Cliente) => {
        this.setState({ selectedClient: client, editDialogOpen: true });
    };

    handleDeleteClick = (client: Cliente) => {
        this.setState({ selectedClient: client, deleteDialogOpen: true });
    };

    handleEditDialogClose = () => {
        this.setState({ editDialogOpen: false, selectedClient: null });
    };

    handleDeleteDialogClose = () => {
        this.setState({ deleteDialogOpen: false, selectedClient: null });
    };

    handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { selectedClient } = this.state;
        if (selectedClient) {
            const updatedClient = { ...selectedClient, [e.target.name]: e.target.value };
            this.setState({ selectedClient: updatedClient });
        }
    };

    handleSaveClient = () => {
        const { selectedClient, clientes } = this.state;
        if (selectedClient) {
            const updatedClientes = clientes.map(client => client.email === selectedClient.email ? selectedClient : client);
            this.setState({ clientes: updatedClientes, editDialogOpen: false, selectedClient: null });
        }
    };

    handleConfirmDelete = () => {
        const { selectedClient, clientes } = this.state;
        if (selectedClient) {
            const updatedClientes = clientes.filter(client => client.email !== selectedClient.email);
            this.setState({ clientes: updatedClientes, deleteDialogOpen: false, selectedClient: null });
        }
    };
	
    render() {
        const filteredClients = this.filterClients();
		const { filterOption, editDialogOpen, deleteDialogOpen, selectedClient } = this.state;
		const { tema } = this.props;

		return (
			<div style={{ marginTop: this.props.tema.spacing(2), marginBottom: this.props.tema.spacing(2) }}>
				<Typography variant="h2" style={{ fontFamily: this.props.tema.typography.fontFamily, marginLeft: this.props.tema.spacing(2), marginRight: this.props.tema.spacing(2), color: '#515151' }}>Lista de Clientes</Typography>
				<FormControl variant="outlined" style={{ marginTop: this.props.tema.spacing(2), marginLeft: this.props.tema.spacing(2), marginRight: this.props.tema.spacing(2), minWidth: 200 }}>
					<InputLabel id="filter-select-label">Filtrar</InputLabel>
					<Select
						labelId="filter-select-label"
						id="filter-select"
						value={filterOption}
						onChange={this.handleFilterChange}
						label="Filtrar"
					>
						<MenuItem value="">Listar todos os clientes</MenuItem>
						<MenuItem value="top10Quantidade">Listar os 10 clientes que mais consumiram</MenuItem>
						<MenuItem value="bottom10Quantidadegit ">Listar os 10 clientes que menos consumiram</MenuItem>
						<MenuItem value="maisConsumiramPorValor">Listar os 5 clientes que mais consumiram em valor</MenuItem>
						<MenuItem value="listarPorGenero">Listar todos os clientes por gênero</MenuItem>
					</Select>
				</FormControl>
				{filterOption === 'listarPorGenero' && (filteredClients as FilteredClientsByGender).map((group, index) => (
                <div key={index}>
                    <Typography variant="h6">{`Gênero: ${group.gender} (${group.clients.length})`}</Typography>
                    {group.clients.map((client, idx) => (
                        <Accordion key={`${group.gender}-${idx}`} className={tema.palette.primary.main}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${index}-content`}
                                id={`panel${index}-header`}
                            >
                                <Typography>{client.nome}</Typography>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Box>
                                    <IconButton onClick={() => this.handleEditClick(client)} aria-label="edit">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => this.handleDeleteClick(client)} aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List>
                                    <ListItem>
                                        <ListItemText primary={`Sobrenome: ${client.sobrenome}`} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={`Telefone: ${client.telefone}`} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={`Email: ${client.email}`} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={`Gênero: ${client.genero}`} />
                                    </ListItem>
                                    <ListItem>
                                                    <ListItemText primary={`Produtos Consumidos:`} />
                                                    <List>
                                                        {client.produtosConsumidos?.map((produto, idx) => (
                                                            <ListItem key={idx}>
                                                                <ListItemText primary={`${produto.nome} - ${produto.descricao} - Preço: ${produto.preco}`} />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText primary={`Serviços Consumidos:`} />
                                                    <List>
                                                        {client.servicosConsumidos?.map((servico, idx) => (
                                                            <ListItem key={idx}>
                                                                <ListItemText primary={`${servico.nome} - ${servico.descricao} - Preço: ${servico.preco}`} />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </ListItem>
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            ))}
            {filterOption !== 'listarPorGenero' && (filteredClients as Cliente[]).map((client, index) => (
                <Accordion key={index} className={tema.palette.primary.main}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}-content`}
                        id={`panel${index}-header`}
                    >
                        <Typography>{client.nome}</Typography>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Box>
                                    <IconButton onClick={() => this.handleEditClick(client)} aria-label="edit">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => this.handleDeleteClick(client)} aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List>
                            <ListItem>
                                <ListItemText primary={`Sobrenome: ${client.sobrenome}`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={`Telefone: ${client.telefone}`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={`Email: ${client.email}`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={`Gênero: ${client.genero}`} />
                            </ListItem>
                            <ListItem>
                                                <ListItemText primary={`Produtos Consumidos:`} />
                                                <List>
                                                    {client.produtosConsumidos && client.produtosConsumidos.map((produto, idx) => (
                                                        <ListItem key={idx}>
                                                            <ListItemText primary={`${produto.nome} - ${produto.descricao} - Preço: ${produto.preco}`} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primary={`Serviços Consumidos:`} />
                                                <List>
                                                    {client.servicosConsumidos && client.servicosConsumidos.map((servico, idx) => (
                                                        <ListItem key={idx}>
                                                            <ListItemText primary={`${servico.nome} - ${servico.descricao} - Preço: ${servico.preco}`} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </ListItem>
                        
                        </List>
                    </AccordionDetails>
                </Accordion>
            ))}
<Dialog open={editDialogOpen} onClose={this.handleEditDialogClose}>
                    <DialogTitle>Editar Cliente</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="nome"
                            label="Nome"
                            type="text"
                            fullWidth
                            value={selectedClient?.nome || ''}
                            onChange={this.handleClientChange}
                        />
                        <TextField
                            margin="dense"
                            name="sobrenome"
                            label="Sobrenome"
                            type="text"
                            fullWidth
                            value={selectedClient?.sobrenome || ''}
                            onChange={this.handleClientChange}
                        />
                        <TextField
                            margin="dense"
                            name="telefone"
                            label="Telefone"
                            type="text"
                            fullWidth
                            value={selectedClient?.telefone || ''}
                            onChange={this.handleClientChange}
                        />
                        <TextField
                            margin="dense"
                            name="email"
                            label="E-mail"
                            type="email"
                            fullWidth
                            value={selectedClient?.email || ''}
                            onChange={this.handleClientChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleEditDialogClose} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={this.handleSaveClient} color="primary">
                            Salvar
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={deleteDialogOpen} onClose={this.handleDeleteDialogClose}>
                    <DialogTitle>Excluir Cliente</DialogTitle>
                    <DialogContent>
                        <Typography>Tem certeza de que deseja excluir este cliente?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDeleteDialogClose} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={this.handleConfirmDelete} color="primary">
                            Excluir
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

const ListaCliente = ListaClienteBase;

export default ListaCliente;
