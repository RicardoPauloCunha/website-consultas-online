import EspecialidadeEnum from "../enums/especialidade";
import StatusAgendamentoEnum from "../enums/statusAgendamento";

interface Agendamento {
    id: number;
    pacienteNome: string;
    pacienteCpf: string;
    pacienteContato: string;
    medicoNome: string;
    especialidade: EspecialidadeEnum;
    dataCriacao: string;
    dataAgendada: string;
    horaAgendada: string;
    status: StatusAgendamentoEnum;
}

export default Agendamento;