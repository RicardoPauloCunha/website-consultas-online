import { get, getParams, post, put } from "../api";
import Paciente from "../entities/paciente";
import GeneroEnum from "../enums/genero";
import TipoUsuarioEnum from "../enums/tipoUsuario";

const ROOT = "pacientes/";

export interface PostPatientRequest {
    nome: string;
    email: string;
    senha: string;
    tipoUsuario: TipoUsuarioEnum;
    cpf: string;
    dataNascimento: string;
    sexo: GeneroEnum;
    endereco: string;
    contato: string;
}

export const postPatientHttp = async (requestData: PostPatientRequest): Promise<Paciente> => {
    let { data } = await post<PostPatientRequest, Paciente>(ROOT, requestData);
    return data;
}

export const listPatientHttp = async (): Promise<Paciente> => {
    let { data } = await get<Paciente>(ROOT);
    return data;
}

export const getPatientByIdHttp = async (userId: number): Promise<Paciente> => {
    let { data } = await get<Paciente>(ROOT + userId);
    return data;
}

interface GetPatientByParams {
    cpf: string;
}

export const getPatientByParamsHttp = async (paramsData: GetPatientByParams): Promise<Paciente> => {
    let { data } = await getParams<GetPatientByParams, Paciente>(ROOT + "filter", paramsData);
    return data;
}

interface PutPatientRequest extends PostPatientRequest {

}

export const putPatientHttp = async (userId: number, requestData: PutPatientRequest): Promise<void> => {
    await put<PutPatientRequest, void>(ROOT + userId, requestData);
}