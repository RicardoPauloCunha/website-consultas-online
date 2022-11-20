import { useEffect, useState } from "react";

import Usuario from "../../services/entities/usuario";
import { listTipoUsuarioToManage } from "../../services/enums/tipoUsuario";
import { listEmployeeByParamsHttp } from "../../services/http/employee";
import { WarningTuple } from "../../util/getHttpErrors";
import DocumentTitle from "../../util/documentTitle";

import { Form } from "../../styles/components";
import SelectInput from "../../components/Input/select";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import EmployeeCard from "../../components/DataCard/employee";

const Employees = () => {
    const _employeeTypes = listTipoUsuarioToManage();

    const [isLoading, setIsLoading] = useState<"get" | "status" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);

    const [employees, setEmployees] = useState<Usuario[]>([]);

    useEffect(() => {
        getEmployees(0);
    }, []);

    const getEmployees = (employeeType: number) => {
        setWarning(["", ""]);

        setIsLoading("get");
        listEmployeeByParamsHttp({
            tipoFuncionario: employeeType
        }).then(response => {
            setEmployees([...response]);

            if (response.length === 0)
                setWarning(["warning", "Nenhum funcionário foi encontrado."]);

            setIsLoading("");
        });
    }

    const handlerChangeEmployeeType = (optionValue: string) => {
        let employeeType = Number(optionValue);
        getEmployees(employeeType);
    }

    DocumentTitle("Funcionários | CM");

    return (
        <>
            <h1>Lista de funcionários</h1>

            <Form
                ref={null}
                onSubmit={() => { }}
                className="form-search"
            >
                <SelectInput
                    name='employeeType'
                    label='Tipo de funcionário'
                    placeholder='Filtrar pelo tipo de funcionário'
                    options={_employeeTypes.map((x, index) => ({
                        value: `${index + 1}`,
                        label: x
                    }))}
                    handlerChange={handlerChangeEmployeeType}
                />

                <Warning value={warning} />
            </Form>

            {isLoading === "get" && <SpinnerBlock />}

            {employees.map(x => (
                <EmployeeCard
                    key={x.idUsuario}
                    id={x.idUsuario}
                    name={x.nome}
                    email={x.email}
                    userType={x.tipoUsuario}
                />
            ))}
        </>
    );
}

export default Employees;