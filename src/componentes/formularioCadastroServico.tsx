import React, { useState } from "react";
import { TextField, Button, Grid, useMediaQuery, useTheme } from "@mui/material";

interface Servico {
    nome: string;
    descricao: string;
    preco: number;
}

interface Props {
    tema: string;
    onCadastroServico: (servico: Servico) => void;
}

const FormularioCadastroServico: React.FC<Props> = ({ tema, onCadastroServico }) => {
    const [formData, setFormData] = useState<Servico>({
        nome: "",
        descricao: "",
        preco: 0,
    });

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onCadastroServico(formData);
        setFormData({
            nome: "",
            descricao: "",
            preco: 0,
        });
    };

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <form onSubmit={handleFormSubmit}>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="nome"
                                label="Nome do Serviço"
                                variant="outlined"
                                name="nome"
                                value={formData.nome}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="descricao"
                                label="Descrição"
                                variant="outlined"
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="preco"
                                label="Preço"
                                variant="outlined"
                                name="preco"
                                type="number"
                                value={formData.preco}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                type="submit"
                                className={tema}
                                fullWidth={isMobile}
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    );
};

export default FormularioCadastroServico;
