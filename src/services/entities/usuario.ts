import TipoUsuarioEnum from "../enums/tipoUsuario";

interface Usuario {
    idUsuario: number;
    nome: string;
    email: string;
    senha: string;
    tipoUsuario: TipoUsuarioEnum;
}

export default Usuario;