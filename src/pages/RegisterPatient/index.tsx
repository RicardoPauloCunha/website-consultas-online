import { useEffect, useRef, useState } from "react";
import { FormHandles, SubmitHandler } from "@unform/core";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

import { useAuth } from "../../contexts/auth";
import { listGeneroPaciente } from "../../services/enums/generoPaciente";
import TipoUsuarioEnum from "../../services/enums/tipoUsuario";
import { getPatientByCpfHttp, postPatientHttp, putPatientHttp } from "../../services/http/patient";
import { WarningTuple } from "../../util/getHttpErrors";
import { normalizeString, normalizeDate } from "../../util/formatString";
import getValidationErrors from "../../util/getValidationErrors";
import { concatenateAddress, splitAddress } from "../../util/formatAddress";
import DocumentTitle from "../../util/documentTitle";

import { Form } from "../../styles/components";
import Warning from "../../components/Warning";
import LoadingButton from "../../components/LoadingButton";
import FieldInput from "../../components/Input";
import SelectInput from "../../components/Input/select";
import MaskInput from "../../components/Input/mask";

type PatientFormData = {
    cpf: string;
    name: string;
    birthDate: string;
    gender: number;
    contact: string;
    cep: string;
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Patient = () => {
    const routeParams = useParams();
    const patientFormRef = useRef<FormHandles>(null);
    const navigate = useNavigate();

    const { loggedUser } = useAuth();

    const _genderTypes = listGeneroPaciente();

    const [isLoading, setIsLoading] = useState<"patientForm" | "getPatient" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [isEdition, setIsEdition] = useState(false);
    const [isReceptionist, setIsReceptionist] = useState(false);

    useEffect(() => {
        setIsLoading("");
        setWarning(["", ""]);

        let edition = location.pathname.split("/")[2] === "editar";
        setIsEdition(edition);

        let receptionist = loggedUser?.userType === TipoUsuarioEnum.Recepcionista;
        setIsReceptionist(receptionist);

        if (edition)
            getPatient();
        else
            patientFormRef.current?.reset();
        // eslint-disable-next-line
    }, [routeParams]);

    const getPatient = () => {
        if (!loggedUser)
            return;

        setIsLoading("getPatient");
        getPatientByCpfHttp(loggedUser.cpf).then(response => {
            let address = splitAddress(response.endereco);

            setTimeout(() => {
                patientFormRef.current?.setData({
                    cpf: response.cpf,
                    name: response.nome,
                    birthDate: new Date(normalizeDate(response.dataNascimento)).toLocaleDateString(),
                    gender: response.sexo.toString(),
                    contact: response.contato,
                    ...address,
                    email: response.email,
                    password: response.senha,
                    confirmPassword: response.senha,
                });
            }, 100);

            setIsLoading("");
        }).catch(() => {
            setWarning(["danger", "Paciente não encontrado."]);
        });
    }

    const submitPatientForm: SubmitHandler<PatientFormData> = async (data, { reset }) => {
        try {
            setIsLoading("patientForm");
            setWarning(["", ""]);
            patientFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                cpf: Yup.string().trim()
                    .required("Coloque o CPF do paciente."),
                name: Yup.string().trim()
                    .required("Coloque o nome do paciente."),
                birthDate: Yup.string().trim()
                    .required("Coloque a data de nascimento do paciente."),
                gender: Yup.string().trim()
                    .required("Selecione o gênero."),
                contact: Yup.string().trim()
                    .required("Coloque o contato (telefone) do paciente."),
                cep: Yup.string().trim()
                    .required("Coloque o CEP do endereço."),
                street: Yup.string().trim()
                    .required("Coloque a rua do endereço."),
                number: Yup.string().trim()
                    .required("Coloque o número do endereço."),
                district: Yup.string().trim()
                    .required("Coloque o bairro do endereço."),
                city: Yup.string().trim()
                    .required("Coloque a cidade do endereço."),
                state: Yup.string().trim()
                    .required("Coloque o estado (UF) do endereço."),
                email: Yup.string().trim()
                    .required("Coloque o email do paciente."),
                password: Yup.string().trim()
                    .required("Coloque a senha do paciente."),
                confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'As senhas precisam ser iguais.'),
            });

            await shema.validate(data, {
                abortEarly: false
            });

            let patientData = {
                cpf: normalizeString(data.cpf),
                nome: data.name,
                dataNascimento: normalizeDate(data.birthDate),
                sexo: Number(data.gender),
                endereco: concatenateAddress({ ...data }),
                contato: normalizeString(data.contact),
                email: data.email,
                senha: data.password,
            }

            if (!isEdition) {
                postPatientHttp(patientData).then(response => {
                    let from = isReceptionist
                        ? "/consultas"
                        : "/consultas-paciente";

                    navigate(from);
                }).catch(() => {
                    setWarning(["danger", "Não foi possível cadastrar o paciente."]);
                }).finally(() => { setIsLoading(""); });
            }
            else {
                putPatientHttp(patientData).then(() => {
                    setWarning(["success", "Paciente editado com sucesso."]);
                }).catch(() => {
                    setWarning(["danger", "Não foi possível editar o paciente."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                patientFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do paciente inválidos."]);
            setIsLoading("");
        }
    }

    DocumentTitle("Paciente | CM");

    return (
        <>
            <h1>{isEdition ? "Editar" : "Cadastrar"} paciente</h1>

            <Form
                ref={patientFormRef}
                onSubmit={submitPatientForm}
                className="form-modal"
            >
                <h2>Informações pessoais</h2>

                <MaskInput
                    name='cpf'
                    label='CPF'
                    mask="999.999.999-99"
                    maskChar=""
                    placeholder='000.000.000-00'
                    disabled={isEdition}
                />

                <FieldInput
                    name='name'
                    label='Nome'
                    placeholder='Coloque o nome'
                />

                <MaskInput
                    name='birthDate'
                    label='Data de nascimento'
                    mask="99/99/9999"
                    maskChar=""
                    placeholder='00/00/0000'
                />

                <SelectInput
                    name='gender'
                    label='Gênero'
                    placeholder='Selecione o gênero'
                    options={_genderTypes.map((x, index) => ({
                        value: `${index + 1}`,
                        label: x
                    }))}
                />

                <MaskInput
                    name='contact'
                    label='Contato (celular)'
                    mask="(99) 99999-9999"
                    placeholder="(00) 00000-0000"
                    maskChar=""
                />

                <h2>Endereço</h2>

                <MaskInput
                    name='cep'
                    label='CEP'
                    mask="99999-999"
                    placeholder="00000-000"
                    maskChar=""
                />

                <FieldInput
                    name='street'
                    label='Rua'
                    placeholder='Coloque a rua'
                />

                <FieldInput
                    name='number'
                    label='Número'
                    placeholder='Coloque o número'
                />

                <FieldInput
                    name='district'
                    label='Bairro'
                    placeholder='Coloque o bairro'
                />

                <FieldInput
                    name='city'
                    label='Cidade'
                    placeholder='Coloque a cidade'
                />

                <MaskInput
                    name='state'
                    label='Estado (UF)'
                    mask="aa"
                    maskChar=""
                    placeholder='SP'
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
                    isLoading={isLoading === "patientForm"}
                    type='button'
                    color={isEdition ? "warning" : "secondary"}
                    onClick={() => patientFormRef.current?.submitForm()}
                />
            </Form>
        </>
    );
}

export default Patient;