
import EspecialidadeEnum, { getValueEspecialidade } from "../../services/enums/especialidade";
import { normalizeDate } from "../../util/formatString";
import DataText from "../DataText";
import { DataCardEl } from "./styles";

type AttendanceCardProps = {
    id: number;
    date: string;
    specialty: EspecialidadeEnum;
    doctorName: string;
    description: string;
}

const AttendanceCard = ({ id, date, specialty, doctorName, description }: AttendanceCardProps) => {
    return (
        <DataCardEl className="data-card-attendance">
            <DataText
                label={getValueEspecialidade(specialty)}
                value={new Date(normalizeDate(date)).toLocaleDateString()}
            />

            <DataText
                label="Serviço"
                value={getValueEspecialidade(specialty)}
            />

            <DataText
                label="Médico"
                value={doctorName}
            />

            <DataText
                label="Descrição"
                value={description}
            />
        </DataCardEl>
    );
}

export default AttendanceCard;