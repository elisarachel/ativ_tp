import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';

export interface Servico {
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
        return item ? item.servicos : [];
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
			.map((serviceName) => servicos.find((servico) => servico.nome === serviceName))
			.filter((servico) => servico !== undefined) as Servico[];
	};
	
    const filterServices = () => {
        switch (filterOption) {
            case 'mostConsumed':
                return calculaServicosMaisConsumidos();
            case 'listarPorGenero':
                return filterServicesByGender(selectedGender);
            default:
                return servicos;
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
                        </List>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
}

export default ListaServicos;
