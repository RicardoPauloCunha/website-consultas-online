import { get, getParams, post, put } from '../api';
import Funcionario from '../entities/funcionario';
import TipoUsuarioEnum from '../enums/tipoUsuario';

const ROOT = "funcionarios/";

export const getEmployeeByIdHttp = async (userId: number): Promise<Funcionario> => {
    let { data } = await get<Funcionario>(ROOT + userId);
    return data;
}

interface ListEmployeeByParams {
    tipoFuncionario: TipoUsuarioEnum;
}

export const listEmployeeByParamsHttp = async (paramsData: ListEmployeeByParams): Promise<Funcionario[]> => {
    let { data } = await getParams<ListEmployeeByParams, Funcionario[]>(ROOT + "tipofuncionario", paramsData);
    return data;
}

export interface PostEmployeeRequest {
    nome: string;
    email: string;
    senha: string;
    tipoUsuario?: number;
    setor: string;
}

export const postEmployeeHttp = async (requestData: PostEmployeeRequest): Promise<void> => {
    await post<PostEmployeeRequest, void>(ROOT, requestData);
}

interface PutEmployeeRequest extends PostEmployeeRequest {

}

export const putEmployeeHttp = async (userId: number, requestData: PutEmployeeRequest): Promise<void> => {
    await put<PutEmployeeRequest, void>(ROOT + userId, requestData);
}