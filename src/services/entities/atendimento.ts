import Agendamento from "./agendamento";

interface Atendimento {
    idAtendimento: number;
    agendamento: Agendamento;
    dataCriacao: string;
    descricao: string;
}

export default Atendimento;