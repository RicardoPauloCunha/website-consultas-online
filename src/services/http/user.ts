import { get, getParams, post } from '../api';
import Usuario from '../entities/usuario';
import TipoUsuarioEnum from '../enums/tipoUsuario';

const ROOT = "usuarios/";

interface PostLoginUserRequest {
    email: string;
    senha: string;
}

export const postLoginUserHttp = async (requestData: PostLoginUserRequest): Promise<Usuario> => {
    let { data } = await post<PostLoginUserRequest, Usuario>(ROOT + "login", requestData);
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