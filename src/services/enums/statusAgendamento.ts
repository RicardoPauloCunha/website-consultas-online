enum StatusAgendamentoEnum {
    Scheduled = 1,
    Unchecked = 2,
    Progress = 3,
    Concluded = 4,
    Canceled = 5,
}

export const getValueStatusAgendamento = (status: StatusAgendamentoEnum) => {
    switch (status) {
        case StatusAgendamentoEnum.Scheduled:
            return "Agendado";
        case StatusAgendamentoEnum.Unchecked:
            return "Desmarcado";
        case StatusAgendamentoEnum.Progress:
            return "Andamento";
        case StatusAgendamentoEnum.Concluded:
            return "Concluído";
        case StatusAgendamentoEnum.Canceled:
            return "Cancelado";
        default:
            return "";
    }
}

export const listStatusAgendamento = () => {
    let list: string[] = [];

    for (let i = 1; i <= 4; i++)
        list.push(getValueStatusAgendamento(i));

    return list;
}

export const defineColorStatusAgendamento = (status: number) => {
    switch (status) {
        case StatusAgendamentoEnum.Scheduled:
            return "info";
        case StatusAgendamentoEnum.Unchecked:
        case StatusAgendamentoEnum.Canceled:
            return "danger";
        case StatusAgendamentoEnum.Progress:
            return "warning";
        case StatusAgendamentoEnum.Concluded:
            return "success";
        default:
            return "";
    }
}

export default StatusAgendamentoEnum;