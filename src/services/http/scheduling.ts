import { get, getParams, patch, post } from "../api";
import Agendamento from "../entities/agendamento";
import EspecialidadeEnum from "../enums/especialidade";
import StatusAgendamentoEnum from "../enums/statusAgendamento";

const ROOT = "agendamentos/";

interface PostSchedulingRequest {
    idPaciente: number;
    idMedico: number;
    especialidade: EspecialidadeEnum;
    dataCriacao: string;
    dataAgendada: string;
    horaAgendada: string;
}

export const postSchedulingHttp = async (requestData: PostSchedulingRequest): Promise<void> => {
    await post<PostSchedulingRequest, void>(ROOT, requestData);
}

interface ListReceptionistSchedulingByParams {
    cpf: string | undefined;
    status: StatusAgendamentoEnum | undefined;
}

export const listSchedulingByParamsHttp = async (paramsData: ListReceptionistSchedulingByParams): Promise<Agendamento[]> => {
    let { data } = await getParams<ListReceptionistSchedulingByParams, Agendamento[]>(ROOT, paramsData);
    return data;
}

interface ListDoctorSchedulingByParams {
    idMedico: number;
    dias: number | undefined;
    status: StatusAgendamentoEnum | undefined;
}

export const listDoctorSchedulingByParamsHttp = async (paramsData: ListDoctorSchedulingByParams): Promise<Agendamento[]> => {
    let { data } = await getParams<ListDoctorSchedulingByParams, Agendamento[]>(ROOT + "filter", paramsData);
    return data;
}

export const listSchedulingBySpecialtyHttp = async (specialty: EspecialidadeEnum): Promise<Agendamento[]> => {
    let { data } = await get<Agendamento[]>(ROOT + "filter/" + specialty);
    return data;
}

interface PatchScheduling {
    status: StatusAgendamentoEnum;
}

export const patchSchedulingHttp = async (schedulingId: number, requestData: PatchScheduling): Promise<void> => {
    await patch<PatchScheduling, void>(ROOT + schedulingId, requestData);
}