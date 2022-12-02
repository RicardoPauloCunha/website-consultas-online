import { get, getParams } from '../api';
import Usuario from '../entities/usuario';
import TipoUsuarioEnum from '../enums/tipoUsuario';

const ROOT = "usuarios/";

interface PostLoginUserRequest {
    email: string;
    senha: string;
}

export const postLoginUserHttp = async (requestData: PostLoginUserRequest): Promise<Usuario> => {
    // let { data } = await post<PostLoginUserRequest, Usuario>(ROOT + "login", requestData);
    // let data = {
    //     id: 1,
    //     nome: "Nome usuário",
    //     email: "user1@gmail.com",
    //     senha: "123456",
    //     tipoUsuario: TipoUsuarioEnum.Paciente,
    //     ativo: true
    // }
    // let data = {
    //     id: 2,
    //     nome: "Gerente",
    //     email: "gerente@gmail.com",
    //     senha: "123456",
    //     tipoUsuario: TipoUsuarioEnum.Gerente,
    //     setor: "Administração",
    //     ativo: true
    // }
    // let data = {
    //     id: 3,
    //     nome: "Funcionário 1 ED",
    //     email: "funcionario1@gmail.com",
    //     senha: "123456",
    //     tipoUsuario: TipoUsuarioEnum.Recepcionista,
    //     ativo: true
    // }
    let data = {
        id: 4,
        nome: "Médico ED",
        email: "medico1@gmail.com",
        senha: "123456",
        tipoUsuario: TipoUsuarioEnum.Medico,
        ativo: true
    }
    return data;
}

interface ListUserByParams {
    tipo: TipoUsuarioEnum;
}

export const listUserByParamsHttp = async (paramsData: ListUserByParams): Promise<Usuario[]> => {
    let { data } = await getParams<ListUserByParams, Usuario[]>(ROOT + "filter", paramsData);
    return data;
}

export const getUserByIdHttp = async (userId: number): Promise<Usuario> => {
    let { data } = await get<Usuario>(ROOT + userId);
    return data;
}