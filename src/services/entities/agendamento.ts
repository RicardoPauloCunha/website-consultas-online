import StatusAgendamentoEnum from "../enums/statusAgendamento";
import TipoEspecialidadeEnum from "../enums/tipoEspecialidade";
import Medico from "./medico";
import Paciente from "./paciente";
import Usuario from "./usuario";

interface Agendamento {
    idAgendamento: number;
    usuario: Usuario;
    paciente: Paciente;
    medico: Medico;
    dataCriacao: string;
    dataAgendada: string;
    horaAgendada: string;
    tipoEspecialidade: TipoEspecialidadeEnum;
    status: StatusAgendamentoEnum;
}

export default Agendamento;