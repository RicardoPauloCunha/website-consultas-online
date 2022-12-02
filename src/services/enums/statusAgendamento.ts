enum StatusAgendamentoEnum {
    Agendado = "AGENDADO",
    Desmarcado = "DESMARCADO",
    Andamento = "ANDAMENTO",
    Concluido = "CONCLUIDO",
    Cancelado = "CANCELADO",
}

export const getValueStatusAgendamento = (status: StatusAgendamentoEnum) => {
    switch (status) {
        case StatusAgendamentoEnum.Agendado:
            return "Agendado";
        case StatusAgendamentoEnum.Desmarcado:
            return "Desmarcado";
        case StatusAgendamentoEnum.Andamento:
            return "Andamento";
        case StatusAgendamentoEnum.Concluido:
            return "Concluído";
        case StatusAgendamentoEnum.Cancelado:
            return "Cancelado";
        default:
            return "";
    }
}

export const listStatusAgendamento = () => {
    let list: StatusAgendamentoEnum[] = [
        StatusAgendamentoEnum.Agendado,
        StatusAgendamentoEnum.Desmarcado,
        StatusAgendamentoEnum.Andamento,
        StatusAgendamentoEnum.Concluido,
        StatusAgendamentoEnum.Cancelado,
    ];

    return list;
}

export const defineColorStatusAgendamento = (status: StatusAgendamentoEnum) => {
    switch (status) {
        case StatusAgendamentoEnum.Agendado:
            return "info";
        case StatusAgendamentoEnum.Desmarcado:
        case StatusAgendamentoEnum.Cancelado:
            return "danger";
        case StatusAgendamentoEnum.Andamento:
            return "warning";
        case StatusAgendamentoEnum.Concluido:
            return "success";
        default:
            return "";
    }
}

export default StatusAgendamentoEnum;