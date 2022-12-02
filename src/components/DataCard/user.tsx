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
        switch (userType) {
            case TipoUsuarioEnum.Medico:
                navigate("/medicos/" + id + "/editar");
                break;
            case TipoUsuarioEnum.Recepcionista:
                navigate("/funcionarios/" + id + "/editar");
                break;
        }
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

            {userType !== TipoUsuarioEnum.Paciente && <Button
                color="warning"
                onClick={() => onClickEditData()}
            >
                Editar
            </Button>}
        </DataCardEl>
    );
}

export default UserCard;