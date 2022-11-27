import { get, getParams, post, put } from '../api';
import Usuario from '../entities/usuario';
import TipoUsuarioEnum from '../enums/tipoUsuario';

const ROOT = "funcionarios/";

export const getUserByIdHttp = async (userId: number): Promise<Usuario> => {
    let { data } = await get<Usuario>(ROOT + userId);
    return data;
}

interface ListUserByParams {
    tipo: TipoUsuarioEnum;
}

export const listUserByParamsHttp = async (paramsData: ListUserByParams): Promise<Usuario[]> => {
    let { data } = await getParams<ListUserByParams, Usuario[]>(ROOT + "filter", paramsData);
    return data;
}

interface PostLoginUserRequest {
    email: string;
    senha: string;
}

export const postLoginUserHttp = async (requestData: PostLoginUserRequest): Promise<Usuario> => {
    let { data } = await post<PostLoginUserRequest, Usuario>(ROOT + "login", requestData);
    return data;
}

export interface PostUserRequest {
    nome: string;
    email: string;
    senha: string;
    tipoUsuario: number;
}

export const postUserHttp = async (requestData: PostUserRequest): Promise<void> => {
    await post<PostUserRequest, void>(ROOT, requestData);
}

interface PutUserRequest extends PostUserRequest {
    idUsuario: number;
}

export const putUserHttp = async (requestData: PutUserRequest): Promise<void> => {
    await put<PutUserRequest, void>(ROOT + "alterar-funcionario", requestData);
}