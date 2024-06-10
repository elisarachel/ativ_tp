import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { withTheme, Theme } from '@mui/material/styles';
import { SelectChangeEvent } from '@mui/material';

export interface Produto {
    nome: string;
    descricao: string;
    preco: number;
}

interface Props {
    produtos: Produto[];
    produtosConsumidosPorGenero: { genero: string; produtos: Produto[] }[];
	tema: Theme;
}

class ListaProdutosBase extends React.Component<Props> {
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

    filterProductsByGender = (genero: string) => {
        const item = this.props.produtosConsumidosPorGenero.find(item => item.genero === genero);
        return item ? item.produtos : [];
    };

    filterProducts = () => {
        switch (this.state.filterOption) {
            case 'mostConsumed':
                return this.calculaProdutosMaisConsumidos();
            case 'listarPorGenero':
                return this.filterProductsByGender(this.state.selectedGender);
            default:
                return this.props.produtos;
        }
    };

    calculaProdutosMaisConsumidos = () => {
        const productCounts: { [key: string]: number } = {};
        this.props.produtosConsumidosPorGenero.forEach(({ produtos }) => {
            produtos.forEach((produto) => {
                productCounts[produto.nome] = (productCounts[produto.nome] || 0) + 1;
            });
        });

        const sortedProducts = Object.keys(productCounts).sort((a, b) => productCounts[b] - productCounts[a]);

        return sortedProducts
        .map((productName) => this.props.produtos.find((produto) => produto.nome === productName))
        .filter((produto) => produto !== undefined) as Produto[];
    };

    render() {
        const filteredProducts = this.filterProducts();
        const genders = ["Masculino", "Feminino", "Não-binário", "Outros"];
		const { tema } = this.props;

        return (
            <div style={{ marginTop: this.props.tema.spacing(2), marginBottom: this.props.tema.spacing(2) }}>
                <Typography variant="h2" style={{ fontFamily: tema.typography.fontFamily, marginLeft: this.props.tema.spacing(2), marginRight: this.props.tema.spacing(2), color: '#515151' }}>Lista de Produtos</Typography>
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
                {filteredProducts.map((produto: Produto, index: number) => (
                    <Accordion key={index} className={tema.palette.primary.main}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${index}-content`}
                            id={`panel${index}-header`}
                        >
                            <Typography>{produto.nome}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                <ListItem>
                                    <ListItemText primary={`Descrição: ${produto.descricao}`} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={`Preço: ${produto.preco}`} />
                                </ListItem>
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
        );
    }
}


const ListaProdutos = ListaProdutosBase;

export default ListaProdutos;
