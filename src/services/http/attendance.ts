import { getParams, post } from "../api";
import Atendimento from "../entities/atendimento";

const ROOT = "atendimentos/";

interface PostAttendanceRequest {
    idAgendamento: number;
    descricao: string;
}

export const postAttendanceHttp = async (requestData: PostAttendanceRequest): Promise<void> => {
    await post<PostAttendanceRequest, void>(ROOT, requestData);
}

interface ListAttendanceByParams {
    idPaciente: number;
}

export const ListAttendanceByParamsHttp = async (paramsData: ListAttendanceByParams): Promise<Atendimento[]> => {
    let { data } = await getParams<ListAttendanceByParams, Atendimento[]>(ROOT, paramsData);
    return data;
}