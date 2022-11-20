import { useNavigate } from "react-router-dom";

import TipoUsuarioEnum, { getValueTipoUsuario } from "../../services/enums/tipoUsuario";

import { Button } from "reactstrap";
import { DataCardEl } from "./styles";
import DataText from "../DataText";

type EmployeeCardProps = {
    id: number;
    name: string;
    email: string;
    userType: TipoUsuarioEnum;
}

const EmployeeCard = ({ id, name, email, userType }: EmployeeCardProps) => {
    const navigate = useNavigate();

    const onClickEditData = () => {
        if (userType === TipoUsuarioEnum.Medico)
            navigate("/funcionarios/medicos/" + id + "/editar");
        else
            navigate("/funcionarios/" + id + "/editar");
    }

    return (
        <DataCardEl className="data-card-employee" >
            <DataText
                label={name}
                value={email}
            />

            <DataText
                label="Tipo funcionário"
                value={`${getValueTipoUsuario(userType)}`}
            />

            <Button
                color="warning"
                onClick={() => onClickEditData()}
            >
                Editar
            </Button>
        </DataCardEl>
    );
}

export default EmployeeCard;