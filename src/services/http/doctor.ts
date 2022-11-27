import { get, getParams, post, put } from "../api";
import Medico from "../entities/medico";
import { PostEmployeeRequest } from "./employee";

const ROOT = "medicos/";

export const getDoctorByIdHttp = async (doctorId: number): Promise<Medico> => {
    let { data } = await get<Medico>(ROOT + doctorId);
    return data;
}

interface ListDoctorByParams {
    especialidade: number | undefined;
}

export const listDoctorByParamsHttp = async (paramsData: ListDoctorByParams): Promise<Medico[]> => {
    let { data } = await getParams<ListDoctorByParams, Medico[]>(ROOT + "filter", paramsData);
    return data;
}

export interface PostDoctorRequest extends PostEmployeeRequest {
    crm: string;
    especialidade: number;
}

export const postDoctorHttp = async (requestData: PostDoctorRequest): Promise<void> => {
    await post<PostDoctorRequest, void>(ROOT, requestData);
}

interface PutDoctorRequest extends PostDoctorRequest {

}

export const putDoctorHttp = async (userId: number, requestData: PutDoctorRequest): Promise<void> => {
    await put<PutDoctorRequest, void>(ROOT + userId, requestData);
}