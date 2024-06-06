import React, { useEffect, useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete, Grid, Chip } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import { Produto } from "./listaProdutos";
import { Servico } from "./listaServicos";
import { SelectChangeEvent } from '@mui/material';

type ProdutoConsumido = {
    id: number;
    clienteId: number;
    produtoId: number;
    produto: Produto;
};

type ServicoConsumido = {
    id: number;
    clienteId: number;
    servicoId: number;
    servico: Servico;
};

type Cliente = {
    id: number;
    nome: string;
    sobrenome: string;
    telefone: string;
    email: string;
    genero: string;
    produtosConsumidos: ProdutoConsumido[];
    servicosConsumidos: ServicoConsumido[];
};

interface Props {
    clientes: Cliente[];
    produtosOptions: Produto[];
    servicosOptions: Servico[];
    onUpdateClient: (updatedClient: Cliente) => void;
}

type FilteredClientsByGender = { gender: string; clients: Cliente[] }[];

export default function ListaCliente(props: Props) {
    const { clientes, produtosOptions, servicosOptions, onUpdateClient } = props;
    const theme = useTheme();
    const [filterOption, setFilterOption] = useState('');
    const [editClient, setEditClient] = useState<Cliente | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [clientList, setClientList] = useState<Cliente[]>(clientes);

    useEffect(() => {
        setClientList(clientes); // Ensure clientList updates when props.clientes changes
    }, [clientes]);

    const handleFilterChange = (event: SelectChangeEvent<string>) => {
        setFilterOption(event.target.value);
    };

    const filterClients = (): Cliente[] | FilteredClientsByGender => {
        switch (filterOption) {
            case 'top10Quantidade':
                return getTop10ClientesPorQuantidade(true, 10);
            case 'bottom10Quantidade':
                return getTop10ClientesPorQuantidade(false, 10);
            case 'maisConsumiramPorValor':
                return getTop5ClientesPorValor(true, 5);
            case 'listarPorGenero':
                const clientsByGender: { [key: string]: Cliente[] } = {};
                clientList.forEach((cliente: Cliente) => {
                    const genero = cliente.genero.toString();
                    if (clientsByGender[genero]) {
                        clientsByGender[genero].push(cliente);
                    } else {
                        clientsByGender[genero] = [cliente];
                    }
                });
                return Object.entries(clientsByGender).map(([gender, clients]) => ({ gender, clients }));
            default:
                return clientList;
        }
    };

    const getTop10ClientesPorQuantidade = (most: boolean, count: number) => {
        const clientsWithTotalConsumption = clientList.map((client: Cliente) => {
            const totalProductsConsumed = client.produtosConsumidos ? client.produtosConsumidos.length : 0;
            const totalServicesConsumed = client.servicosConsumidos ? client.servicosConsumidos.length : 0;
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

    const getTop5ClientesPorValor = (most: boolean, count: number) => {
        const clientsWithTotalPrice = clientList.map((client: Cliente) => {
            const totalPriceProducts = client.produtosConsumidos ? client.produtosConsumidos.reduce((total, produto) => total + (produto.produto.preco || 0), 0) : 0;
            const totalPriceServices = client.servicosConsumidos ? client.servicosConsumidos.reduce((total, servico) => total + (servico.servico.preco || 0), 0) : 0;    
            const totalPriceConsumed = totalPriceProducts + totalPriceServices;
            return { ...client, totalPriceConsumed };
        });

        clientsWithTotalPrice.sort((a, b) => {
            const diff = a.totalPriceConsumed - b.totalPriceConsumed;
            return most ? -diff : diff;
        });

        return clientsWithTotalPrice.slice(0, count);
    };

    const handleEditClient = (id: number, updatedData: Cliente) => {
        fetch(`http://localhost:5000/api/clientes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update client');
            }
            return response.json();
        })
        .then(data => {
            console.log('Client updated:', data);
            
            const updatedClient = {
                ...data,
                produtosConsumidos: data.produtosConsumidos?.map((pc: any) => ({
                    ...pc,
                    produto: pc.produto || produtosOptions.find(p => p.id === pc.produtoId)
                })) || [],
                servicosConsumidos: data.servicosConsumidos?.map((sc: any) => ({
                    ...sc,
                    servico: sc.servico || servicosOptions.find(s => s.id === sc.servicoId)
                })) || []
            };

            setClientList(prevClients => 
                prevClients.map(cliente => 
                    cliente.id === id ? updatedClient : cliente
                )
            );

            onUpdateClient(updatedClient); // Update parent component
            setOpenEditDialog(false);
            setEditClient(null); // Reset the edit client state
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const handleDeleteClient = (id: number) => {
        fetch(`http://localhost:5000/api/clientes/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            console.log('Client deleted:', data);
            setClientList(prevClients =>
                prevClients.filter(cliente => cliente.id !== id)
            );
        })
        .catch(error => console.error('Error:', error));
    };

    const handleEditButtonClick = (client: Cliente) => {
        setEditClient(client);
        setOpenEditDialog(true);
    };

    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
        setEditClient(null);
    };

    const handleEditDialogSave = () => {
        if (editClient) {
            console.log('Data being sent to backend:', JSON.stringify(editClient, null, 2));
            handleEditClient(editClient.id, editClient);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editClient) {
            setEditClient({ ...editClient, [e.target.name]: e.target.value });
        }
    };
    
    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        if (editClient) {
            setEditClient({ ...editClient, [name]: value });
        }
    };

    const handleProdutosChange = (event: any, value: Produto[]) => {
        if (editClient) {
            const produtosConsumidos: ProdutoConsumido[] = value.map(produto => ({
                id: 0, // Assuming you set this to 0 since it's generated by the backend
                clienteId: editClient.id,
                produtoId: produto.id,
                produto: produto,
            }));
            setEditClient(prevEditClient => ({
                ...prevEditClient!,
                produtosConsumidos: produtosConsumidos,
            }));
        }
    };

    const handleServicosChange = (event: any, value: Servico[]) => {
        if (editClient) {
            const servicosConsumidos: ServicoConsumido[] = value.map(servico => ({
                id: 0, // Assuming you set this to 0 since it's generated by the backend
                clienteId: editClient.id,
                servicoId: servico.id,
                servico: servico,
            }));
            setEditClient(prevEditClient => ({
                ...prevEditClient!,
                servicosConsumidos: servicosConsumidos,
            }));
        }
    };

    const filteredClients = filterClients();

    return (
        <div style={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(2) }}>
            <Typography variant="h2" style={{ fontFamily: theme.typography.fontFamily, marginLeft: theme.spacing(2), marginRight: theme.spacing(2), color: '#515151' }}>Lista de Clientes</Typography>
            <FormControl variant="outlined" style={{ marginTop: theme.spacing(2), marginLeft: theme.spacing(2), marginRight: theme.spacing(2), minWidth: 200 }}>
                <InputLabel id="filter-select-label">Filtrar</InputLabel>
                <Select
                    labelId="filter-select-label"
                    id="filter-select"
                    value={filterOption}
                    onChange={handleFilterChange}
                    label="Filtrar"
                >
                    <MenuItem value="">Listar todos os clientes</MenuItem>
                    <MenuItem value="top10Quantidade">Listar os 10 clientes que mais consumiram</MenuItem>
                    <MenuItem value="bottom10Quantidade">Listar os 10 clientes que menos consumiram</MenuItem>
                    <MenuItem value="maisConsumiramPorValor">Listar os 5 clientes que mais consumiram em valor</MenuItem>
                    <MenuItem value="listarPorGenero">Listar todos os clientes por gênero</MenuItem>
                </Select>
            </FormControl>
            {filterOption === 'listarPorGenero' && (filteredClients as FilteredClientsByGender).map((group, index) => (
                <div key={index}>
                    <Typography variant="h6">{`Gênero: ${group.gender} (${group.clients.length})`}</Typography>
                    {group.clients.map((client, idx) => (
                        <Accordion key={`${group.gender}-${idx}`} className={theme.palette.primary.main}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${index}-content`}
                                id={`panel${index}-header`}
                            >
                                <Typography>{client.nome}</Typography>
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
                                        <ListItemText primary={`Produtos Consumidos: ${client.produtosConsumidos?.map(produto => produto.produto.nome).join(', ')}`} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={`Serviços Consumidos: ${client.servicosConsumidos?.map(servico => servico.servico.nome).join(', ')}`} />
                                    </ListItem>
                                    <ListItem>
                                        <Button variant="outlined" color="primary" onClick={() => handleEditButtonClick(client)}>Editar</Button>
                                        <Button variant="outlined" color="secondary" onClick={() => handleDeleteClient(client.id)}>Excluir</Button>
                                    </ListItem>
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            ))}
            {filterOption !== 'listarPorGenero' && (filteredClients as Cliente[]).map((client, index) => (
                <Accordion key={client.id} className={theme.palette.primary.main}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}-content`}
                        id={`panel${index}-header`}
                    >
                        <Typography>{client.nome}</Typography>
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
                                <ListItemText primary={`Produtos Consumidos: ${client.produtosConsumidos?.map(produtoCliente => produtoCliente.produto.nome).join(', ')}`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={`Serviços Consumidos: ${client.servicosConsumidos?.map(servicoCliente => servicoCliente.servico.nome).join(', ')}`} />
                            </ListItem>
                            <ListItem>
                                <Button variant="outlined" color="primary" onClick={() => handleEditButtonClick(client)} style={{ marginRight: '8px' }}>Editar</Button>
                                <Button variant="outlined" color="secondary" onClick={() => handleDeleteClient(client.id)}>Excluir</Button>
                            </ListItem>
                        </List>
                    </AccordionDetails>
                </Accordion>
            ))}
            <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
                <DialogTitle>Editar Cliente</DialogTitle>
                <DialogContent>
                    {editClient && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    margin="dense"
                                    label="Nome"
                                    type="text"
                                    fullWidth
                                    name="nome"
                                    value={editClient.nome}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    margin="dense"
                                    label="Sobrenome"
                                    type="text"
                                    fullWidth
                                    name="sobrenome"
                                    value={editClient.sobrenome}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    margin="dense"
                                    label="Telefone"
                                    type="text"
                                    fullWidth
                                    name="telefone"
                                    value={editClient.telefone}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    margin="dense"
                                    label="E-mail"
                                    type="email"
                                    fullWidth
                                    name="email"
                                    value={editClient.email}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth margin="dense">
                                    <InputLabel id="genero-label">Gênero</InputLabel>
                                    <Select
                                        labelId="genero-label"
                                        id="genero"
                                        name="genero"
                                        value={editClient.genero}
                                        onChange={handleSelectChange}
                                    >
                                        <MenuItem value="Masculino">Masculino</MenuItem>
                                        <MenuItem value="Feminino">Feminino</MenuItem>
                                        <MenuItem value="Não-binário">Não-binário</MenuItem>
                                        <MenuItem value="Outro">Outro</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    multiple
                                    id="produtosConsumidos"
                                    options={produtosOptions}
                                    getOptionLabel={(option: Produto) => option.nome}
                                    value={editClient.produtosConsumidos.map(pc => pc.produto)}
                                    onChange={handleProdutosChange}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={(params) => <TextField {...params} label="Produtos Consumidos" variant="outlined" />}
                                    renderTags={(tagValue, getTagProps) => 
                                        tagValue.map((option, index) => (
                                            <Chip label={option.nome} {...getTagProps({ index })} />
                                        ))
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    multiple
                                    id="servicosConsumidos"
                                    options={servicosOptions}
                                    getOptionLabel={(option: Servico) => option.nome}
                                    value={editClient.servicosConsumidos.map(sc => sc.servico)}
                                    onChange={handleServicosChange}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={(params) => <TextField {...params} label="Serviços Consumidos" variant="outlined" />}
                                    renderTags={(tagValue, getTagProps) => 
                                        tagValue.map((option, index) => (
                                            <Chip label={option.nome} {...getTagProps({ index })} />
                                        ))
                                    }
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose} color="primary">Cancelar</Button>
                    <Button onClick={handleEditDialogSave} color="primary">Salvar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
