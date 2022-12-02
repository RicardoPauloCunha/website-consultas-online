import { get, getParams, post, put } from "../api";
import Medico from "../entities/medico";
import EspecialidadeEnum from "../enums/especialidade";
import { PostEmployeeRequest } from "./employee";

const ROOT = "medicos/";

export interface PostDoctorRequest extends PostEmployeeRequest {
    crm: string;
    especialidade: EspecialidadeEnum;
}

export const postDoctorHttp = async (requestData: PostDoctorRequest): Promise<void> => {
    await post<PostDoctorRequest, void>(ROOT, requestData);
}

export const listDoctorHttp = async (): Promise<Medico[]> => {
    let { data } = await get<Medico[]>(ROOT);
    return data;
}

export const getDoctorByIdHttp = async (doctorId: number): Promise<Medico> => {
    let { data } = await get<Medico>(ROOT + doctorId);
    return data;
}

interface ListDoctorByParams {
    especialidade?: EspecialidadeEnum;
}

export const listDoctorByParamsHttp = async (paramsData: ListDoctorByParams): Promise<Medico[]> => {
    let { data } = await getParams<ListDoctorByParams, Medico[]>(ROOT + "filter", paramsData);
    return data;
}

interface PutDoctorRequest extends PostDoctorRequest {

}

export const putDoctorHttp = async (userId: number, requestData: PutDoctorRequest): Promise<void> => {
    await put<PutDoctorRequest, void>(ROOT + userId, requestData);
}