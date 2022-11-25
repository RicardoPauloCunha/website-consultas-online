import { FormHandles, SubmitHandler } from "@unform/core";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import * as Yup from 'yup';
import FieldInput from "../../components/Input";
import SelectInput from "../../components/Input/select";
import LoadingButton from "../../components/LoadingButton";
import Warning from "../../components/Warning";
import Medico from "../../services/entities/medico";
import Usuario from "../../services/entities/usuario";
import { listTipoEspecialidade } from "../../services/enums/tipoEspecialidade";
import TipoUsuarioEnum from "../../services/enums/tipoUsuario";
import { getDoctorByIdHttp, postDoctorHttp, putDoctorHttp } from "../../services/http/doctor";
import { getUserByIdHttp, postUserHttp, putUserHttp } from "../../services/http/user";
import { Form } from "../../styles/components";
import DocumentTitle from "../../util/documentTitle";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";

interface UserFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface DoctorFormData extends UserFormData {
    crm: string;
    specialtyType: number;
}

const RegisterUser = () => {
    const location = useLocation();
    const routeParams = useParams();
    const userFormRef = useRef<FormHandles>(null);
    const doctorFormRef = useRef<FormHandles>(null);

    const _specialtyTypes = listTipoEspecialidade();

    const [isLoading, setIsLoading] = useState<"register" | "get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [isDoctor, setIsDoctor] = useState(location.pathname.split("/")[1] === "medicos");
    const [isEdition, setIsEdition] = useState(routeParams.userId !== undefined || routeParams.doctorId !== undefined);

    const [editedUser, setEditedUser] = useState<Usuario | undefined>(undefined);
    const [editedDoctor, setEditedDoctor] = useState<Medico | undefined>(undefined);

    useEffect(() => {
        setIsLoading("");
        setWarning(["", ""]);
        setEditedDoctor(undefined);
        setEditedUser(undefined);

        if (routeParams.userId !== undefined) {
            setIsEdition(true);
            getUser();
        }
        else if (routeParams.doctorId !== undefined) {
            setIsEdition(true);
            getDoctor();
        }
        else {
            setIsEdition(false);
            userFormRef.current?.reset();
            doctorFormRef.current?.reset();
        }

        if (location.pathname.split("/")[2] === "medicos")
            setIsDoctor(true);
        else
            setIsDoctor(false);
        // eslint-disable-next-line
    }, [routeParams]);

    useEffect(() => {
        if (!isDoctor && editedUser !== undefined) {
            setTimeout(() => {
                userFormRef.current?.setData({
                    name: editedUser.nome,
                    email: editedUser.email,
                    password: editedUser.senha,
                    confirmPassword: editedUser.senha
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
    }, [isDoctor, editedUser, editedDoctor])

    const getUser = () => {
        let id = Number(routeParams.userId);
        if (isNaN(id))
            return;

        setIsLoading("get");
        getUserByIdHttp(id).then(response => {
            setEditedUser(response);
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

    const submitUserForm: SubmitHandler<UserFormData> = async (data, { reset }) => {
        try {
            setIsLoading("register");
            setWarning(["", ""]);
            userFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                name: Yup.string().trim()
                    .required("Coloque o nome do usuário."),
                email: Yup.string().trim()
                    .required("Coloque o email do usuário."),
                password: Yup.string().trim()
                    .required("Coloque a senha do usuário."),
                confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'As senhas precisam ser iguais.')
            });

            await shema.validate(data, {
                abortEarly: false
            });

            let userData = {
                nome: data.name,
                email: data.email,
                senha: data.password,
                tipoUsuario: TipoUsuarioEnum.Recepcionista
            };

            if (!isEdition) {
                await postUserHttp(userData).then(() => {
                    setWarning(["success", "Usuário cadastrado com sucesso."]);
                    reset();
                }).catch(() => {
                    setWarning(["danger", "Não foi possível cadastrar o usuário."]);
                }).finally(() => { setIsLoading(""); });
            }
            else if (editedUser !== undefined) {
                await putUserHttp({
                    ...userData,
                    idUsuario: editedUser.idUsuario
                }).then(() => {
                    setWarning(["success", "Usuário editado com sucesso."]);
                    editedUser.nome = data.name;
                }).catch(() => {
                    setWarning(["danger", "Não foi possível editar o usuário."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                userFormRef.current?.setErrors(getValidationErrors(err));
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
                ref={isDoctor ? doctorFormRef : userFormRef}
                onSubmit={isDoctor ? submitDoctorForm : submitUserForm}
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

                {isDoctor && <>
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
                </>}

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

export default RegisterUser;