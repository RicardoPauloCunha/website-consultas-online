import { Button } from "reactstrap";
import StatusAgendamentoEnum, { defineColorStatusAgendamento, getValueStatusAgendamento } from "../../services/enums/statusAgendamento";
import TipoEspecialidadeEnum, { getValueTipoEspecialidade } from "../../services/enums/tipoEspecialidade";
import DataText from "../DataText";
import StatusBadge from "../StatusBadge";
import { DataCardEl } from "./styles";

type SchedulingCardProps = {
    id: number;
    patientName: string;
    time: string;
    date: string;
    status: StatusAgendamentoEnum;
    specialty: TipoEspecialidadeEnum;
    doctorName?: string;
    onClickOpenSchedule: (scheduleId: number) => void;
}

const SchedulingCard = ({ id, patientName, time, date, status, specialty, doctorName, onClickOpenSchedule }: SchedulingCardProps) => {
    return (
        <DataCardEl className={doctorName ? "data-card-scheduling" : "data-card-scheduling-doctor"}>
            <DataText
                label={patientName}
                value={new Date(date + "T" + time).toLocaleString()}
            />

            <StatusBadge
                label="Status"
                status={status}
                value={getValueStatusAgendamento(status)}
                defineColor={defineColorStatusAgendamento}
            />

            <DataText
                label="Serviço"
                value={getValueTipoEspecialidade(specialty)}
            />

            {doctorName && <DataText
                label="Médico"
                value={doctorName}
            />}

            <Button
                color="info"
                onClick={() => onClickOpenSchedule(id)}
            >
                Abrir
            </Button>
        </DataCardEl>
    );
}

export default SchedulingCard;