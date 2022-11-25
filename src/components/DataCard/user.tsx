import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import TipoUsuarioEnum, { getValueTipoUsuario } from "../../services/enums/tipoUsuario";
import DataText from "../DataText";
import { DataCardEl } from "./styles";

type UserCardProps = {
    id: number;
    name: string;
    email: string;
    userType: TipoUsuarioEnum;
}

const UserCard = ({ id, name, email, userType }: UserCardProps) => {
    const navigate = useNavigate();

    const onClickEditData = () => {
        if (userType === TipoUsuarioEnum.Medico)
            navigate("/funcionarios/medicos/" + id + "/editar");
        else
            navigate("/funcionarios/" + id + "/editar");
    }

    return (
        <DataCardEl className="data-card-user" >
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

export default UserCard;