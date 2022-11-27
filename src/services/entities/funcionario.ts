import Usuario from "./usuario";

interface Funcionario extends Usuario {
    setor: string;
}

export default Funcionario;