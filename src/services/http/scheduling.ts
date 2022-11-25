import { getParams, post, put } from "../api";
import Agendamento from "../entities/agendamento";
import StatusAgendamentoEnum from "../enums/statusAgendamento";

const ROOT = "agendamentos/";

interface ListReceptionistSchedulingByParams {
    cpf: string | undefined;
    status: number | undefined;
}

export const listReceptionistSchedulingByParamsHttp = async (paramsData: ListReceptionistSchedulingByParams): Promise<Agendamento[]> => {
    let { data } = await getParams<ListReceptionistSchedulingByParams, Agendamento[]>(ROOT + "listar-por-cpf-e-status", paramsData);
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
    userId: number;
    pacienteCpf: string;
    medicoId: number;
    dataAgendada: string;
    horaAgendada: string;
    tipoEspecialidade: number;
    status: number;
}

export const postSchedulingHttp = async (requestData: PostSchedulingRequest): Promise<void> => {
    await post<PostSchedulingRequest, void>(ROOT, requestData);
}

interface PutScheduling {
    idAgendamento: number;
    usuario: {
        idUsuario: number;
    }
    paciente: {
        cpf: string;
    }
    medico: {
        idUsuario: number;
    }
    dataCriacao: string;
    dataAgendada: string;
    horaAgendada: string;
    tipoEspecialidade: number;
    status: StatusAgendamentoEnum;
}

export const putSchedulingHttp = async (requestData: PutScheduling): Promise<void> => {
    await put<PutScheduling, void>(ROOT, requestData);
}