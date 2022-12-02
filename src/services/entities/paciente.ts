import GeneroEnum from "../enums/genero";
import Usuario from "./usuario";

interface Paciente extends Usuario {
    cpf: string;
    dataNascimento: string;
    sexo: GeneroEnum;
    endereco: string;
    contato: string;
}

export default Paciente;