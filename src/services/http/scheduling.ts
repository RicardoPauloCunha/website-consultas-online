import { getParams, post, put } from "../api";
import Agendamento from "../entities/agendamento";

const ROOT = "agendamentos/";

interface ListReceptionistSchedulingByParams {
    cpf: string | undefined;
    status: number | undefined;
}

export const listSchedulingByParamsHttp = async (paramsData: ListReceptionistSchedulingByParams): Promise<Agendamento[]> => {
    let { data } = await getParams<ListReceptionistSchedulingByParams, Agendamento[]>(ROOT + "filter", paramsData);
    return data;
}

interface ListDoctorSchedulingByParams {
    idMedico: number;
    periodo: number | undefined;
    status: number | undefined;
}

export const listDoctorSchedulingByParamsHttp = async (paramsData: ListDoctorSchedulingByParams): Promise<Agendamento[]> => {
    let { data } = await getParams<ListDoctorSchedulingByParams, Agendamento[]>(ROOT + "listar-por-medico-id-e-periodo", paramsData);
    return data;
}

interface PostSchedulingRequest {
    idPaciente: number;
    idMedico: number;
    especialidade: number;
    dataCriacao: string;
    dataAgendada: string;
    horaAgendada: string;
}

export const postSchedulingHttp = async (requestData: PostSchedulingRequest): Promise<void> => {
    await post<PostSchedulingRequest, void>(ROOT, requestData);
}

interface PutScheduling extends Agendamento {

}

export const putSchedulingHttp = async (schedulingId: number, requestData: PutScheduling): Promise<void> => {
    await put<PutScheduling, void>(ROOT, requestData);
}