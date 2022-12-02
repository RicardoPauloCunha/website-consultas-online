import { get, post, put } from '../api';
import Funcionario from '../entities/funcionario';
import TipoUsuarioEnum from '../enums/tipoUsuario';

const ROOT = "funcionarios/";

export interface PostEmployeeRequest {
    nome: string;
    email: string;
    senha: string;
    tipoUsuario?: TipoUsuarioEnum;
    setor: string;
}

export const postEmployeeHttp = async (requestData: PostEmployeeRequest): Promise<void> => {
    await post<PostEmployeeRequest, void>(ROOT, requestData);
}

export const listEmployeeHttp = async (): Promise<Funcionario[]> => {
    let { data } = await get<Funcionario[]>(ROOT);
    return data;
}

export const getEmployeeByIdHttp = async (userId: number): Promise<Funcionario> => {
    let { data } = await get<Funcionario>(ROOT + userId);
    return data;
}

interface PutEmployeeRequest extends PostEmployeeRequest {

}

export const putEmployeeHttp = async (userId: number, requestData: PutEmployeeRequest): Promise<void> => {
    await put<PutEmployeeRequest, void>(ROOT + userId, requestData);
}