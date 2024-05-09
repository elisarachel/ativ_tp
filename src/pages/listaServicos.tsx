import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { withTheme } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export interface Servico {
    nome: string;
    descricao: string;
    preco: number;
}

interface Props {
    servicos: Servico[];
    servicosConsumidosPorGenero: { genero: string; servicos: Servico[] }[];
	tema: Theme;
}

class ListaServicosBase extends React.Component<Props> {
    state = {
        filterOption: '',
        selectedGender: '',
    };

    handleFilterChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        this.setState({ filterOption: value });
        if (value !== 'listarPorGenero') {
            this.setState({ selectedGender: '' });
        }
    };

    handleGenderFilterChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        this.setState({ selectedGender: value });
    };

    filterServicesByGender = (genero: string) => {
        const item = this.props.servicosConsumidosPorGenero.find(item => item.genero === genero);
        return item ? item.servicos : [];
    };

    calculaServicosMaisConsumidos = () => {
        const serviceCounts: { [key: string]: number } = {};
        this.props.servicosConsumidosPorGenero.forEach(({ servicos }) => {
            servicos.forEach((servico) => {
                serviceCounts[servico.nome] = (serviceCounts[servico.nome] || 0) + 1;
            });
        });

        const sortedServices = Object.keys(serviceCounts).sort((a, b) => serviceCounts[b] - serviceCounts[a]);

        return sortedServices
        .map((serviceName) => this.props.servicos.find((servico) => servico.nome === serviceName))
        .filter((servico) => servico !== undefined) as Servico[];
    };

    filterServices = () => {
        switch (this.state.filterOption) {
            case 'mostConsumed':
                return this.calculaServicosMaisConsumidos();
            case 'listarPorGenero':
                return this.filterServicesByGender(this.state.selectedGender);
            default:
                return this.props.servicos;
        }
    };

    render() {
        const filteredServices = this.filterServices();
        const genders = ["Masculino", "Feminino", "Não-binário", "Outros"];
		const { tema } = this.props;

        return (
            <div style={{ marginTop: this.props.tema.spacing(2), marginBottom: this.props.tema.spacing(2) }}>
                <Typography variant="h2" style={{ fontFamily: this.props.tema.typography.fontFamily, marginLeft: this.props.tema.spacing(2), marginRight: this.props.tema.spacing(2), color: '#515151' }}>Lista de Serviços</Typography>
                <FormControl variant="outlined" style={{ marginTop: this.props.tema.spacing(2), marginLeft: this.props.tema.spacing(2), marginRight: this.props.tema.spacing(2), marginBottom: this.props.tema.spacing(2), minWidth: 200 }}>
                    <InputLabel id="filter-select-label">Filtrar</InputLabel>
                    <Select
                        labelId="filter-select-label"
                        id="filter-select"
                        value={this.state.filterOption}
                        onChange={this.handleFilterChange}
                        label="Filtrar"
                    >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="mostConsumed">Mais Consumidos</MenuItem>
                        <MenuItem value="listarPorGenero">Por Gênero</MenuItem>
                    </Select>
                </FormControl>
                {this.state.filterOption === 'listarPorGenero' && (
                    <FormControl variant="outlined" style={{ marginTop: this.props.tema.spacing(2), marginLeft: this.props.tema.spacing(2), marginRight: this.props.tema.spacing(2), minWidth: 200 }}>
                        <InputLabel id="gender-filter-select-label">Filtrar por Gênero</InputLabel>
                        <Select
                            labelId="gender-filter-select-label"
                            id="gender-filter-select"
                            value={this.state.selectedGender}
                            onChange={this.handleGenderFilterChange}
                            label="Filtrar por Gênero"
                        >
                            {genders.map((gender, index) => (
                                <MenuItem key={index} value={gender}>{gender}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                {filteredServices.map((servico: Servico, index: number) => (
                    <Accordion key={index} className={tema.palette.primary.main}>
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
}

const ListaServicos = withTheme(ListaServicosBase);

export default ListaServicos;