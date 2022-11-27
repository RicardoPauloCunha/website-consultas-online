import EspecialidadeEnum from "../enums/especialidade";
import StatusAgendamentoEnum from "../enums/statusAgendamento";
import Medico from "./medico";
import Paciente from "./paciente";

interface Agendamento {
    id: number;
    medico: Medico;
    paciente: Paciente;
    dataCriacao: string;
    dataAgendada: string;
    horaAgendada: string;
    especialidade: EspecialidadeEnum;
    status: StatusAgendamentoEnum;
}

export default Agendamento;