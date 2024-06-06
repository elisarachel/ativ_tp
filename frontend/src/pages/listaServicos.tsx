import React, { useEffect, useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, FormControl, InputLabel, MenuItem, Select, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import { SelectChangeEvent } from '@mui/material';

export interface Servico {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
}

interface Props {
    servicos: Servico[];
    servicosConsumidosPorGenero: { genero: string; servicos: Servico[] }[];
}

const ListaServicos: React.FC<Props> = ({ servicos, servicosConsumidosPorGenero }) => {
    const theme = useTheme();
    const [filterOption, setFilterOption] = useState('');
    const [selectedGender, setSelectedGender] = useState<string>('');
    const [editServico, setEditServico] = useState<Servico | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
	const [serviceList, setServiceList] = useState<Servico[]>(servicos);

	useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/servicos');
            const data = await response.json();
            setServiceList(data);
        } catch (error) {
            console.error('Failed to fetch services:', error);
        }
    };

    const handleFilterChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        setFilterOption(value);
        if (value !== 'listarPorGenero') {
            setSelectedGender('');
        }
    };

    const handleGenderFilterChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        setSelectedGender(value);
    };

    const filterServicesByGender = (genero: string) => {
        const item = servicosConsumidosPorGenero.find(item => item.genero === genero);
        if (item) {
            const serviceCounts: { [key: string]: number } = {};
            item.servicos.forEach((servico) => {
                serviceCounts[servico.nome] = (serviceCounts[servico.nome] || 0) + 1;
            });

            const sortedServices = Object.keys(serviceCounts).sort((a, b) => serviceCounts[b] - serviceCounts[a]);

            return sortedServices
                .map((serviceName) => serviceList.find((servico) => servico.nome === serviceName))
                .filter((servico) => servico !== undefined) as Servico[];
        }
        return [];
    };

    const calculaServicosMaisConsumidos = () => {
        const serviceCounts: { [key: string]: number } = {};
        servicosConsumidosPorGenero.forEach(({ servicos }) => {
            servicos.forEach((servico) => {
                serviceCounts[servico.nome] = (serviceCounts[servico.nome] || 0) + 1;
            });
        });

        const sortedServices = Object.keys(serviceCounts).sort((a, b) => serviceCounts[b] - serviceCounts[a]);

        return sortedServices
			.map((serviceName) => serviceList.find((servico) => servico.nome === serviceName))
            .filter((servico) => servico !== undefined) as Servico[];
    };

    const filterServices = () => {
        switch (filterOption) {
            case 'mostConsumed':
                return calculaServicosMaisConsumidos();
            case 'listarPorGenero':
                return filterServicesByGender(selectedGender);
            default:
                return serviceList;
        }
    };

    const handleEditServico = (id: number, updatedData: Servico) => {
        fetch(`http://localhost:5000/api/servicos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Servico updated:', data);
                setOpenEditDialog(false);
                setServiceList((prevServices) =>
                    prevServices.map((servico) =>
                        servico.id === id ? data : servico
                    )
                );
            })
            .catch(error => console.error('Error:', error));
    };

    const handleDeleteServico = (id: number) => {
        fetch(`http://localhost:5000/api/servicos/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                console.log('Servico deleted:', data);
                setServiceList((prevServices) =>
                    prevServices.filter((servico) => servico.id !== id)
                );
            })
            .catch(error => console.error('Error:', error));
    };

    const handleEditButtonClick = (servico: Servico) => {
        setEditServico(servico);
        setOpenEditDialog(true);
    };

    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
        setEditServico(null);
    };

    const handleEditDialogSave = () => {
        if (editServico) {
            handleEditServico(editServico.id, editServico);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editServico) {
            setEditServico({ ...editServico, [e.target.name]: e.target.value });
        }
    };

    const filteredServices = filterServices();

    const genders = ["Masculino", "Feminino", "Não-binário", "Outros"];

    return (
        <div style={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(2) }}>
            <Typography variant="h2" style={{ fontFamily: theme.typography.fontFamily, marginLeft: theme.spacing(2), marginRight: theme.spacing(2), color: '#515151' }}>Lista de Serviços</Typography>
            <FormControl variant="outlined" style={{ marginTop: theme.spacing(2), marginLeft: theme.spacing(2), marginRight: theme.spacing(2), marginBottom: theme.spacing(2), minWidth: 200 }}>
                <InputLabel id="filter-select-label">Filtrar</InputLabel>
                <Select
                    labelId="filter-select-label"
                    id="filter-select"
                    value={filterOption}
                    onChange={handleFilterChange}
                    label="Filtrar"
                >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="mostConsumed">Mais Consumidos</MenuItem>
                    <MenuItem value="listarPorGenero">Por Gênero</MenuItem>
                </Select>
            </FormControl>
            {filterOption === 'listarPorGenero' && (
                <FormControl variant="outlined" style={{ marginTop: theme.spacing(2), marginLeft: theme.spacing(2), marginRight: theme.spacing(2), minWidth: 200 }}>
                    <InputLabel id="gender-filter-select-label">Filtrar por Gênero</InputLabel>
                    <Select
                        labelId="gender-filter-select-label"
                        id="gender-filter-select"
                        value={selectedGender}
                        onChange={handleGenderFilterChange}
                        label="Filtrar por Gênero"
                    >
                        {genders.map((gender, index) => (
                            <MenuItem key={index} value={gender}>{gender}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            {filteredServices.map((servico: Servico, index: number) => (
                <Accordion key={index} className={theme.palette.primary.main}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}-content`}
                        id={`panel${index}-header`}
                    >
                        <Typography>{servico.nome}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List>
                            <ListItem>
                                <ListItemText primary={`Descrição: ${servico.descricao}`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={`Preço: ${servico.preco}`} />
                            </ListItem>
                            <ListItem>
                                <Button variant="contained" color="primary" onClick={() => handleEditButtonClick(servico)} style={{ marginRight: '8px' }}>Editar</Button>
                                <Button variant="contained" color="secondary" onClick={() => handleDeleteServico(servico.id)}>Deletar</Button>
                            </ListItem>
                        </List>
                    </AccordionDetails>
                </Accordion>
            ))}
            <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
                <DialogTitle>Editar Serviço</DialogTitle>
                <DialogContent>
                    {editServico && (
                        <div>
                            <TextField
                                margin="dense"
                                label="Nome"
                                type="text"
                                fullWidth
                                name="nome"
                                value={editServico.nome}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="dense"
                                label="Descrição"
                                type="text"
                                fullWidth
                                name="descricao"
                                value={editServico.descricao}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="dense"
                                label="Preço"
                                type="number"
                                fullWidth
                                name="preco"
                                value={editServico.preco}
                                onChange={handleInputChange}
                            />
                        </div>
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

export default ListaServicos;
