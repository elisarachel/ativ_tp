import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import { useState } from "react";
import { SelectChangeEvent } from '@mui/material';

export interface Produto {
    nome: string;
    descricao: string;
    preco: number;
}

interface Props {
    produtos: Produto[];
    produtosConsumidosPorGenero: { genero: string; produtos: Produto[] }[];
}

const ListaProdutos: React.FC<Props> = ({ produtos, produtosConsumidosPorGenero }) => {
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

    const filterProductsByGender = (genero: string) => {
        const item = produtosConsumidosPorGenero.find(item => item.genero === genero);
        return item ? item.produtos : [];
    };

    const filterProducts = () => {
        switch (filterOption) {
            case 'mostConsumed':
                return calculaProdutosMaisConsumidos();
            case 'listarPorGenero':
                return filterProductsByGender(selectedGender);
            default:
                return produtos;
        }
    };

	const calculaProdutosMaisConsumidos = () => {
        const productCounts: { [key: string]: number } = {};
        produtosConsumidosPorGenero.forEach(({ produtos }) => {
            produtos.forEach((produto) => {
                productCounts[produto.nome] = (productCounts[produto.nome] || 0) + 1;
            });
        });

        const sortedProducts = Object.keys(productCounts).sort((a, b) => productCounts[b] - productCounts[a]);

        return sortedProducts
        .map((productName) => produtos.find((produto) => produto.nome === productName))
        .filter((produto) => produto !== undefined) as Produto[];
    };

    const filteredProducts = filterProducts();

    const genders = ["Masculino", "Feminino", "Não-binário", "Outros"];

    return (
        <div style={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(2) }}>
            <Typography variant="h2" style={{ fontFamily: theme.typography.fontFamily, marginLeft: theme.spacing(2), marginRight: theme.spacing(2), color: '#515151' }}>Lista de Produtos</Typography>
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
            {filteredProducts.map((produto: Produto, index: number) => (
                <Accordion key={index} className={theme.palette.primary.main}>
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

export default ListaProdutos;
