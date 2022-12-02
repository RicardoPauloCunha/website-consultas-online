import EspecialidadeEnum from "../enums/especialidade";

interface Atendimento {
    id: number;
    descricao: string;
    dataCriacao: string;
    agendamentoEspecialidade: EspecialidadeEnum;
    agendamentoMedicoNome: string;
}

export default Atendimento;