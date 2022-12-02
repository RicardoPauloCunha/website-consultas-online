import { useEffect, useState } from "react";
import UserCard from "../../components/DataCard/user";
import SelectInput from "../../components/Input/select";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import Usuario from "../../services/entities/usuario";
import TipoUsuarioEnum, { getValueTipoUsuario, listTipoUsuario } from "../../services/enums/tipoUsuario";
import { listUserByParamsHttp } from "../../services/http/user";
import { Form } from "../../styles/components";
import DocumentTitle from "../../util/documentTitle";
import { WarningTuple } from "../../util/getHttpErrors";

const Users = () => {
    const _userTypes = listTipoUsuario();

    const [isLoading, setIsLoading] = useState<"get" | "status" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);

    const [users, setUsers] = useState<Usuario[]>([]);

    useEffect(() => {
        getUsers(TipoUsuarioEnum.Paciente);
    }, []);

    const getUsers = (userType: TipoUsuarioEnum) => {
        setWarning(["", ""]);

        setIsLoading("get");
        listUserByParamsHttp({
            tipo: userType
        }).then(response => {
            setUsers([...response]);

            if (response.length === 0)
                setWarning(["warning", "Nenhum usuário foi encontrado."]);

            setIsLoading("");
        });
    }

    const handlerChangeUserType = (optionValue: string) => {
        let userType = optionValue as TipoUsuarioEnum;

        getUsers(userType);
    }

    DocumentTitle("Usuários | CM");

    return (
        <>
            <h1>Lista de usuários</h1>

            <Form
                ref={null}
                onSubmit={() => { }}
                className="form-search"
            >
                <SelectInput
                    name='userType'
                    label='Tipo de usuário'
                    placeholder='Filtrar pelo tipo de usuário'
                    options={_userTypes.map(x => ({
                        value: x,
                        label: getValueTipoUsuario(x)
                    }))}
                    handlerChange={handlerChangeUserType}
                />

                <Warning value={warning} />
            </Form>

            {isLoading === "get" && <SpinnerBlock />}

            {users.map(x => (
                <UserCard
                    key={x.id}
                    id={x.id}
                    name={x.nome}
                    email={x.email}
                    userType={x.tipoUsuario}
                />
            ))}
        </>
    );
}

export default Users;