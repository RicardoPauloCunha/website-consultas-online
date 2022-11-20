import { get, getParams, post, put } from '../api';

import Usuario from '../entities/usuario';
import TipoUsuarioEnum from '../enums/tipoUsuario';

const ROOT = "funcionarios/";

export const getEmployeeByIdHttp = async (employeeId: number): Promise<Usuario> => {
    let { data } = await get<Usuario>(ROOT + employeeId);
    return data;
}

interface ListEmployeeByParams {
    tipoFuncionario: TipoUsuarioEnum;
}

export const listEmployeeByParamsHttp = async (paramsData: ListEmployeeByParams): Promise<Usuario[]> => {
    let { data } = await getParams<ListEmployeeByParams, Usuario[]>(ROOT + "tipofuncionario", paramsData);
    return data;
}

interface PostLoginEmployeeRequest {
    email: string;
    senha: string;
}

export const postLoginUserHttp = async (requestData: PostLoginEmployeeRequest): Promise<Usuario> => {
    let { data } = await post<PostLoginEmployeeRequest, Usuario>(ROOT + "login", requestData);
    return data;
}

export interface PostEmployeeRequest {
    nome: string;
    email: string;
    senha: string;
    tipoUsuario: number;
}

export const postEmployeeHttp = async (requestData: PostEmployeeRequest): Promise<void> => {
    await post<PostEmployeeRequest, void>(ROOT, requestData);
}

interface PutEmployeeRequest extends PostEmployeeRequest {
    idUsuario: number;
}

export const putEmployeeHttp = async (requestData: PutEmployeeRequest): Promise<void> => {
    await put<PutEmployeeRequest, void>(ROOT + "alterar-funcionario", requestData);
}