import { FormHandles, SubmitHandler } from "@unform/core";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import * as Yup from 'yup';
import FieldInput from "../../components/Input";
import LoadingButton from "../../components/LoadingButton";
import Warning from "../../components/Warning";
import TipoUsuarioEnum from "../../services/enums/tipoUsuario";
import { getEmployeeByIdHttp, postEmployeeHttp, PostEmployeeRequest, putEmployeeHttp } from "../../services/http/employee";
import { Form } from "../../styles/components";
import DocumentTitle from "../../util/documentTitle";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";

interface EmployeeFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    sector: string;
}

const RegisterEmployee = () => {
    const location = useLocation();
    const routeParams = useParams();
    const formRef = useRef<FormHandles>(null);

    const [isLoading, setIsLoading] = useState<"form" | "get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [isEdition, setIsEdition] = useState(routeParams.userId !== undefined);

    useEffect(() => {
        setIsLoading("");
        setWarning(["", ""]);

        let edition = location.pathname.split("/")[3] === "editar";
        setIsEdition(edition);

        if (edition)
            getEmployee();
        else
            formRef.current?.reset();
        // eslint-disable-next-line
    }, [routeParams]);

    const getEmployee = () => {
        let id = Number(routeParams.userId);
        if (isNaN(id))
            return;

        setIsLoading("get");
        getEmployeeByIdHttp(id).then(response => {
            setTimeout(() => {
                formRef.current?.setData({
                    name: response.nome,
                    email: response.email,
                    password: response.senha,
                    confirmPassword: response.senha,
                    sector: response.setor
                });
            }, 100);

            setIsLoading("");
        }).catch(() => {
            setWarning(["danger", "Funcion??rio n??o encontrado."]);
        });
    }

    const submitEmployeeForm: SubmitHandler<EmployeeFormData> = async (data, { reset }) => {
        try {
            setIsLoading("form");
            setWarning(["", ""]);
            formRef.current?.setErrors({});

            const shema = Yup.object().shape({
                name: Yup.string().trim()
                    .required("Coloque o nome do funcion??rio."),
                email: Yup.string().trim()
                    .required("Coloque o email do funcion??rio."),
                password: Yup.string().trim()
                    .required("Coloque a senha do funcion??rio."),
                confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'As senhas precisam ser iguais.'),
                sector: Yup.string().trim()
                    .required("Coloque o setor do funcion??rio."),
            });

            await shema.validate(data, {
                abortEarly: false
            });

            let employeeData: PostEmployeeRequest = {
                nome: data.name,
                email: data.email,
                senha: data.password,
                tipoUsuario: TipoUsuarioEnum.Recepcionista,
                setor: data.sector
            };

            if (isEdition) {
                let userId = Number(routeParams.userId);

                await putEmployeeHttp(userId, employeeData).then(() => {
                    setWarning(["success", "Funcion??rio editado com sucesso."]);
                }).catch(() => {
                    setWarning(["danger", "N??o foi poss??vel editar o funcion??rio."]);
                }).finally(() => { setIsLoading(""); });
            }
            else {
                await postEmployeeHttp(employeeData).then(() => {
                    setWarning(["success", "Funcion??rio cadastrado com sucesso."]);
                    reset();
                }).catch(() => {
                    setWarning(["danger", "N??o foi poss??vel cadastrar o funcion??rio."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                formRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do funcion??rio inv??lidos."]);
            setIsLoading("");
        }
    }

    DocumentTitle(`${isEdition ? "Editar" : "Cadastrar"} funcion??rio | CM`);

    return (
        <>
            <h1>{isEdition ? `Edi????o` : `Cadastro`} de funcion??rio</h1>

            <Form
                ref={formRef}
                onSubmit={submitEmployeeForm}
                className="form-data"
            >
                <h2>Informa????es do funcion??rio</h2>

                <FieldInput
                    name='name'
                    label='Nome'
                    placeholder='Coloque o nome'
                />

                <FieldInput
                    name='sector'
                    label='Setor'
                    placeholder='Coloque o setor'
                />

                <h2>Conta de usu??rio</h2>

                <FieldInput
                    name='email'
                    label='E-mail'
                    placeholder='Coloque o email'
                    type="email"
                />

                <FieldInput
                    name='password'
                    label='Senha'
                    placeholder='Coloque a senha'
                    type="password"
                />

                <FieldInput
                    name='confirmPassword'
                    label='Confirmar senha'
                    placeholder='Confirme a senha'
                    type="password"
                />

                <Warning value={warning} />

                <LoadingButton
                    text={isEdition ? "Editar" : "Cadastrar"}
                    isLoading={isLoading === "form" || isLoading === "get"}
                    type='submit'
                    color={isEdition ? "warning" : "secondary"}
                />
            </Form>
        </>
    );
}

export default RegisterEmployee;