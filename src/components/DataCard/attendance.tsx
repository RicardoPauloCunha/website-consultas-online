
import { normalizeDate } from "../../util/formatString";

import { DataCardEl } from "./styles";
import DataText from "../DataText";
import TipoEspecialidadeEnum, { getValueTipoEspecialidade } from "../../services/enums/tipoEspecialidade";

type AttendanceCardProps = {
    id: number;
    date: string;
    specialty: TipoEspecialidadeEnum;
    doctorName: string;
    description: string;
}

const AttendanceCard = ({ id, date, specialty, doctorName, description }: AttendanceCardProps) => {
    return (
        <DataCardEl className="data-card-attendance">
            <DataText
                label={getValueTipoEspecialidade(specialty)}
                value={new Date(normalizeDate(date)).toLocaleDateString()}
            />

            <DataText
                label="Serviço"
                value={getValueTipoEspecialidade(specialty)}
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