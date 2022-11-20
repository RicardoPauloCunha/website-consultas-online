import Usuario from "./usuario";

interface Paciente extends Usuario {
    cpf: string;
    dataNascimento: string;
    sexo: number;
    endereco: string;
    contato: string;
}

export default Paciente;