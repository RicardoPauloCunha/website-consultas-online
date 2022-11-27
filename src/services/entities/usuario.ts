import TipoUsuarioEnum from "../enums/tipoUsuario";

interface Usuario {
    id: number;
    nome: string;
    email: string;
    senha: string;
    tipoUsuario: TipoUsuarioEnum;
    ativo: string;
}

export default Usuario;