import { FormHandles, SubmitHandler } from "@unform/core";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import * as Yup from 'yup';
import FieldInput from "../../components/Input";
import SelectInput from "../../components/Input/select";
import LoadingButton from "../../components/LoadingButton";
import Warning from "../../components/Warning";
import EspecialidadeEnum, { getValueEspecialidade, listEspecialidade } from "../../services/enums/especialidade";
import TipoUsuarioEnum from "../../services/enums/tipoUsuario";
import { getDoctorByIdHttp, postDoctorHttp, PostDoctorRequest, putDoctorHttp } from "../../services/http/doctor";
import { Form } from "../../styles/components";
import DocumentTitle from "../../util/documentTitle";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";

interface DoctorFormData {
    name: string;
    crm: string;
    specialty: string;
    email: string;
    password: string;
    confirmPassword: string;
    sector: string;
}

const RegisterDoctor = () => {
    const location = useLocation();
    const routeParams = useParams();
    const formRef = useRef<FormHandles>(null);

    const _specialties = listEspecialidade();

    const [isLoading, setIsLoading] = useState<"form" | "get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [isEdition, setIsEdition] = useState(routeParams.userId !== undefined);

    useEffect(() => {
        setIsLoading("");
        setWarning(["", ""]);

        let edition = location.pathname.split("/")[3] === "editar";
        setIsEdition(edition);

        if (edition)
            getDoctor();
        else
            // formRef.current?.reset(); // TODO: Remover
            formRef.current?.setData({
                name: "Médico",
                crm: "123456",
                specialty: EspecialidadeEnum.Cardiologista,
                email: "medico1@gmail.com",
                password: "123456",
                confirmPassword: "123456",
                sector: "Atendimentos"
            });
        // eslint-disable-next-line
    }, [routeParams]);

    const getDoctor = () => {
        let id = Number(routeParams.userId);
        if (isNaN(id))
            return;

        setIsLoading("get");
        getDoctorByIdHttp(id).then(response => {
            formRef.current?.setData({
                name: response.nome,
                crm: response.crm,
                specialty: response.especialidade,
                email: response.email,
                password: response.senha,
                confirmPassword: response.senha,
                sector: response.setor
            });

            setIsLoading("");
        }).catch(() => {
            setWarning(["danger", "Médico não encontrado."]);
        });
    }

    const submitDoctorForm: SubmitHandler<DoctorFormData> = async (data, { reset }) => {
        try {
            setIsLoading("form");
            setWarning(["", ""]);
            formRef.current?.setErrors({});

            const shema = Yup.object().shape({
                name: Yup.string().trim()
                    .required("Coloque o nome do médico."),
                crm: Yup.string().trim()
                    .required("Coloque o CRM do médico."),
                specialty: Yup.string()
                    .required("Selecione a especialidade do médico."),
                email: Yup.string().trim()
                    .required("Coloque o email do médico."),
                password: Yup.string().trim()
                    .required("Coloque a senha do médico."),
                confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'As senhas precisam ser iguais.'),
                sector: Yup.string().trim()
                    .required("Coloque o setor do médico."),
            });

            await shema.validate(data, {
                abortEarly: false
            });

            let doctorData: PostDoctorRequest = {
                nome: data.name,
                crm: data.crm,
                especialidade: data.specialty as EspecialidadeEnum,
                email: data.email,
                senha: data.password,
                tipoUsuario: TipoUsuarioEnum.Medico,
                setor: data.sector,
            };

            if (isEdition) {
                let userId = Number(routeParams.userId);

                await putDoctorHttp(userId, doctorData).then(() => {
                    setWarning(["success", "Médico editado com sucesso."]);
                }).catch(() => {
                    setWarning(["danger", "Não foi possível editar o médico."]);
                }).finally(() => { setIsLoading(""); });
            }
            else {
                await postDoctorHttp(doctorData).then(() => {
                    setWarning(["success", "Médico cadastrado com sucesso."]);
                    reset();
                }).catch(() => {
                    setWarning(["danger", "Não foi possível cadastrar o médico."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                formRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do médico inválidos."]);
            setIsLoading("");
        }
    }

    DocumentTitle(`${isEdition ? "Editar" : "Cadastrar"} médico | CM`);

    return (
        <>
            <h1>{isEdition ? `Edição` : `Cadastro`} de médico</h1>

            <Form
                ref={formRef}
                onSubmit={submitDoctorForm}
                className="form-data"
            >
                <h2>Informações do médico</h2>

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

                <FieldInput
                    name='crm'
                    label='CRM'
                    placeholder='Coloque o CRM'
                />

                <SelectInput
                    name='specialty'
                    label='Especialidade'
                    placeholder='Selecione a especialidade'
                    options={_specialties.map(x => ({
                        value: x,
                        label: getValueEspecialidade(x)
                    }))}
                />

                <h2>Conta de usuário</h2>

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

export default RegisterDoctor;