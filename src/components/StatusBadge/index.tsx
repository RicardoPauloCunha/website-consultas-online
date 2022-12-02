import { useEffect, useState } from "react";
import { Badge } from "reactstrap";
import StatusAgendamentoEnum from "../../services/enums/statusAgendamento";
import { StatusBadgeEl } from "./styles";

type StatusBadgeProps = {
    label: string;
    status: StatusAgendamentoEnum | undefined;
    value: string;
    defineColor: (status: StatusAgendamentoEnum) => string;
}

const StatusBadge = ({ label, status, value, defineColor }: StatusBadgeProps) => {
    let [color, setColor] = useState("");

    useEffect(() => {
        if (status)
            setColor(defineColor(status));
        // eslint-disable-next-line
    }, [status]);

    return (
        <StatusBadgeEl>
            <b>{label}</b>
            <div>
                <Badge
                    color={color}
                >
                    {value}
                </Badge>
            </div>
        </StatusBadgeEl>
    );
}

export default StatusBadge;