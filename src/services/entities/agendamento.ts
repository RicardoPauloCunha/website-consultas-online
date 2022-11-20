import Usuario from "./usuario";
import Medico from "./medico";
import Paciente from "./paciente";

import StatusAgendamentoEnum from "../enums/statusAgendamento";
import TipoEspecialidadeEnum from "../enums/tipoEspecialidade";

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