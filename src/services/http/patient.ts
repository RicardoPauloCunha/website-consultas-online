import { get, post, put } from "../api";
import Paciente from "../entities/paciente";

const ROOT = "pacientes/";

export const getPatientByIdHttp = async (userId: number): Promise<Paciente> => {
    let { data } = await get<Paciente>(ROOT + userId);
    return data;
}

export const getPatientByCpfHttp = async (cpf: string): Promise<Paciente> => {
    let { data } = await get<Paciente>(ROOT + cpf);
    return data;
}

// TODO: Remover
export const getPatientCpfByUserIdHttp = async (userId: number): Promise<string> => {
    let { data } = await get<string>(ROOT + "cpf/" + userId);
    return data;
}

export interface PostPatientRequest {
    nome: string;
    email: string;
    senha: string;
    tipoUsuario?: number;
    cpf: string;
    dataNascimento: string;
    sexo: string;
    endereco: string;
    contato: string;
}

export const postPatientHttp = async (requestData: PostPatientRequest): Promise<Paciente> => {
    let { data } = await post<PostPatientRequest, Paciente>(ROOT, requestData);
    return data;
}

interface PutPatientRequest extends PostPatientRequest {

}

export const putPatientHttp = async (userId: number, requestData: PutPatientRequest): Promise<void> => {
    await put<PutPatientRequest, void>(ROOT + userId, requestData);
}