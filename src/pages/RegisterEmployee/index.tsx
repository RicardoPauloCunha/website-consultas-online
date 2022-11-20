import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from 'yup';

import Medico from "../../services/entities/medico";
import Usuario from "../../services/entities/usuario";
import TipoUsuarioEnum, { listTipoUsuarioToManage } from "../../services/enums/tipoUsuario";
import { listTipoEspecialidade } from "../../services/enums/tipoEspecialidade";
import { getEmployeeByIdHttp, postEmployeeHttp, putEmployeeHttp } from "../../services/http/employee";
import { getDoctorByIdHttp, postDoctorHttp, putDoctorHttp } from "../../services/http/doctor";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";
import DocumentTitle from "../../util/documentTitle";

import { Form } from "../../styles/components";
import SelectInput from "../../components/Input/select";
import Warning from "../../components/Warning";
import FieldInput from "../../components/Input";
import LoadingButton from "../../components/LoadingButton";

interface EmployeeFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    userType: number;
}

interface DoctorFormData extends EmployeeFormData {
    crm: string;
    specialtyType: number;
}

const RegisterEmployee = () => {
    const location = useLocation();
    const routeParams = useParams();
    const employeeFormRef = useRef<FormHandles>(null);
    const doctorFormRef = useRef<FormHandles>(null);

    const _employeeTypes = listTipoUsuarioToManage();
    const _specialtyTypes = listTipoEspecialidade();

    const [isLoading, setIsLoading] = useState<"register" | "get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [isDoctor, setIsDoctor] = useState(location.pathname.split("/")[1] === "medicos");
    const [isEdition, setIsEdition] = useState(routeParams.employeeId !== undefined || routeParams.doctorId !== undefined);

    const [editedEmployee, setEditedEmployee] = useState<Usuario | undefined>(undefined);
    const [editedDoctor, setEditedDoctor] = useState<Medico | undefined>(undefined);

    useEffect(() => {
        setIsLoading("");
        setWarning(["", ""]);
        setEditedDoctor(undefined);
        setEditedEmployee(undefined);

        if (routeParams.employeeId !== undefined) {
            setIsEdition(true);
            getEmployee();
        }
        else if (routeParams.doctorId !== undefined) {
            setIsEdition(true);
            getDoctor();
        }
        else {
            setIsEdition(false);
            employeeFormRef.current?.reset();
            doctorFormRef.current?.reset();
        }

        if (location.pathname.split("/")[2] === "medicos")
            setIsDoctor(true);
        else
            setIsDoctor(false);
        // eslint-disable-next-line
    }, [routeParams]);

    useEffect(() => {
        if (!isDoctor && editedEmployee !== undefined) {
            setTimeout(() => {
                employeeFormRef.current?.setData({
                    name: editedEmployee.nome,
                    email: editedEmployee.email,
                    password: editedEmployee.senha,
                    confirmPassword: editedEmployee.senha,
                    userType: editedEmployee.tipoUsuario.toString()
                });
            }, 100);
        }
        else if (isDoctor && editedDoctor !== undefined) {
            setTimeout(() => {
                doctorFormRef.current?.setData({
                    name: editedDoctor.nome,
                    email: editedDoctor.email,
                    password: editedDoctor.senha,
                    confirmPassword: editedDoctor.senha,
                    crm: editedDoctor.crm,
                    specialtyType: editedDoctor.tipoEspecialidade.toString()
                });
            }, 100);
        }
    }, [isDoctor, editedEmployee, editedDoctor])

    const getEmployee = () => {
        let id = Number(routeParams.employeeId);
        if (isNaN(id))
            return;

        setIsLoading("get");
        getEmployeeByIdHttp(id).then(response => {
            setEditedEmployee(response);
            setIsLoading("");
        }).catch(() => {
            setWarning(["danger", "Usuário não encontrado."]);
        });
    }

    const getDoctor = () => {
        let id = Number(routeParams.doctorId);
        if (isNaN(id))
            return;;

        setIsLoading("get");
        getDoctorByIdHttp(id).then(response => {
            setEditedDoctor(response)
            setIsLoading("");
        }).catch(() => {
            setWarning(["danger", "Médico não encontrado."]);
        });
    }

    const submitEmployeeForm: SubmitHandler<EmployeeFormData> = async (data, { reset }) => {
        try {
            setIsLoading("register");
            setWarning(["", ""]);
            employeeFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                name: Yup.string().trim()
                    .required("Coloque o nome do usuário."),
                email: Yup.string().trim()
                    .required("Coloque o email do usuário."),
                password: Yup.string().trim()
                    .required("Coloque a senha do usuário."),
                confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'As senhas precisam ser iguais.'),
                userType: Yup.string()
                    .required("Selecione o tipo de usuário.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            data.userType = Number(data.userType);

            let employeeData = {
                nome: data.name,
                email: data.email,
                senha: data.password,
                tipoUsuario: data.userType
            };

            if (!isEdition) {
                await postEmployeeHttp(employeeData).then(() => {
                    setWarning(["success", "Usuário cadastrado com sucesso."]);
                    reset();
                }).catch(() => {
                    setWarning(["danger", "Não foi possível cadastrar o usuário."]);
                }).finally(() => { setIsLoading(""); });
            }
            else if (editedEmployee !== undefined) {
                await putEmployeeHttp({
                    ...employeeData,
                    idUsuario: editedEmployee.idUsuario
                }).then(() => {
                    setWarning(["success", "Usuário editado com sucesso."]);
                    editedEmployee.nome = data.name;
                }).catch(() => {
                    setWarning(["danger", "Não foi possível editar o usuário."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                employeeFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do usuário inválidos."]);
            setIsLoading("");
        }
    }

    const submitDoctorForm: SubmitHandler<DoctorFormData> = async (data, { reset }) => {
        try {
            setIsLoading("register");
            setWarning(["", ""]);
            doctorFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                name: Yup.string().trim()
                    .required("Coloque o nome do médico."),
                email: Yup.string().trim()
                    .required("Coloque o email do médico."),
                password: Yup.string().trim()
                    .required("Coloque a senha do médico."),
                confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'As senhas precisam ser iguais.'),
                crm: Yup.string().trim()
                    .required("Coloque o CRM do médico."),
                specialtyType: Yup.string()
                    .required("Selecione a especialidade do médico.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            let doctorData = {
                nome: data.name,
                email: data.email,
                senha: data.password,
                tipoUsuario: TipoUsuarioEnum.Medico,
                crm: data.crm,
                tipoEspecialidade: Number(data.specialtyType)
            };

            if (!isEdition) {
                await postDoctorHttp(doctorData).then(() => {
                    setWarning(["success", "Médico cadastrado com sucesso."]);
                    reset();
                }).catch(() => {
                    setWarning(["danger", "Não foi possível cadastrar o médico."]);
                }).finally(() => { setIsLoading(""); });
            }
            else if (editedDoctor !== undefined) {
                await putDoctorHttp({
                    ...doctorData,
                    idUsuario: editedDoctor.idUsuario
                }).then(() => {
                    setWarning(["success", "Médico editado com sucesso."]);
                    editedDoctor.nome = data.name;
                }).catch(() => {
                    setWarning(["danger", "Não foi possível editar o médico."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                doctorFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do médico inválidos."]);
            setIsLoading("");
        }
    }

    DocumentTitle(`${isEdition ? "Editar" : "Cadastrar"} ${isDoctor ? "médico" : "usuário"} | CM`);

    return (
        <>
            <h1>{isEdition ? `Edição de ${isDoctor ? "médico" : "usuário"}` : `Cadastro de ${isDoctor ? "médico" : "usuário"}`}</h1>

            <Form
                ref={isDoctor ? doctorFormRef : employeeFormRef}
                onSubmit={isDoctor ? submitDoctorForm : submitEmployeeForm}
                className="form-data"
            >
                <FieldInput
                    name='name'
                    label='Nome'
                    placeholder='Coloque o nome'
                />

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

                {isDoctor
                    ? <>
                        <FieldInput
                            name='crm'
                            label='CRM'
                            placeholder='Coloque o CRM'
                        />

                        <SelectInput
                            name='specialtyType'
                            label='Especialidade'
                            placeholder='Selecione a especialidade'
                            options={_specialtyTypes.map((x, index) => ({
                                value: `${index + 1}`,
                                label: x
                            }))}
                        />
                    </>
                    : <SelectInput
                        name='userType'
                        label='Tipo de usuário'
                        placeholder='Selecione o tipo de usuário'
                        options={_employeeTypes.map((x, index) => ({
                            value: `${index + 1}`,
                            label: x
                        }))}
                        disabled={isEdition}
                    />
                }

                <Warning value={warning} />

                <LoadingButton
                    text={isEdition ? "Editar" : "Cadastrar"}
                    isLoading={isLoading === "register" || isLoading === "get"}
                    type='submit'
                    color={isEdition ? "warning" : "secondary"}
                />
            </Form>
        </>
    );
}

export default RegisterEmployee;