import { FormHandles, SubmitHandler } from "@unform/core";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import FieldInput from "../../components/Input";
import MaskInput from "../../components/Input/mask";
import SelectInput from "../../components/Input/select";
import LoadingButton from "../../components/LoadingButton";
import Warning from "../../components/Warning";
import { useAuth } from "../../contexts/auth";
import { handlerSignIn } from "../../localStorages/auth";
import GeneroEnum, { getValueGenero, listGenero } from "../../services/enums/genero";
import TipoUsuarioEnum from "../../services/enums/tipoUsuario";
import { getPatientByIdHttp, postPatientHttp, PostPatientRequest, putPatientHttp } from "../../services/http/patient";
import { Form } from "../../styles/components";
import DocumentTitle from "../../util/documentTitle";
import { concatenateAddress, splitAddress } from "../../util/formatAddress";
import { normalizeDate, normalizeString } from "../../util/formatString";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";

type PatientFormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    cpf: string;
    birthDate: string;
    gender: string;
    cep: string;
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
    contact: string;
}

const Patient = () => {
    const location = useLocation();
    const routeParams = useParams();
    const formRef = useRef<FormHandles>(null);
    const navigate = useNavigate();

    const { loggedUser, defineLoggedUser } = useAuth();

    const _genderTypes = listGenero();

    const [isLoading, setIsLoading] = useState<"form" | "get" | "">("");
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
            formRef.current?.reset();
        // eslint-disable-next-line
    }, [routeParams]);

    const getPatient = () => {
        if (!loggedUser || loggedUser?.userType !== TipoUsuarioEnum.Paciente)
            return;

        setIsLoading("get");
        getPatientByIdHttp(loggedUser.userId).then(response => {
            let address = splitAddress(response.endereco);
            let birthDate = new Date(normalizeDate(response.dataNascimento)).toLocaleDateString();

            setTimeout(() => {
                formRef.current?.setData({
                    name: response.nome,
                    email: response.email,
                    password: response.senha,
                    confirmPassword: response.senha,
                    cpf: response.cpf,
                    birthDate,
                    gender: response.sexo,
                    ...address,
                    contact: response.contato,
                });
            }, 100);

            setIsLoading("");
        }).catch(() => {
            setWarning(["danger", "Paciente não encontrado."]);
        });
    }

    const submitPatientForm: SubmitHandler<PatientFormData> = async (data) => {
        try {
            setIsLoading("form");
            setWarning(["", ""]);
            formRef.current?.setErrors({});

            const shema = Yup.object().shape({
                name: Yup.string().trim()
                    .required("Coloque o nome do paciente."),
                email: Yup.string().trim()
                    .required("Coloque o email do paciente."),
                password: Yup.string().trim()
                    .required("Coloque a senha do paciente."),
                confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'As senhas precisam ser iguais.'),
                cpf: Yup.string().trim()
                    .required("Coloque o CPF do paciente."),
                birthDate: Yup.string().trim()
                    .required("Coloque a data de nascimento do paciente."),
                gender: Yup.string().trim()
                    .required("Selecione o gênero."),
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
                contact: Yup.string().trim()
                    .required("Coloque o contato (telefone) do paciente."),
            });

            await shema.validate(data, {
                abortEarly: false
            });

            let patientData: PostPatientRequest = {
                nome: data.name,
                email: data.email,
                senha: data.password,
                tipoUsuario: TipoUsuarioEnum.Paciente,
                cpf: normalizeString(data.cpf),
                dataNascimento: normalizeDate(data.birthDate),
                sexo: data.gender as GeneroEnum,
                endereco: concatenateAddress({ ...data }),
                contato: normalizeString(data.contact),
            }

            if (isEdition) {
                if (!loggedUser || loggedUser.userType !== TipoUsuarioEnum.Paciente)
                    return;

                putPatientHttp(loggedUser.userId, patientData).then(() => {
                    setWarning(["success", "Paciente editado com sucesso."]);
                }).catch(() => {
                    setWarning(["danger", "Não foi possível editar o paciente."]);
                }).finally(() => { setIsLoading(""); });
            }
            else {
                postPatientHttp(patientData).then(response => {
                    let from = "";

                    if (isReceptionist) {
                        from = "/agendamentos/cadastrar";
                    }
                    else {
                        from = "/meus-agendamentos/listar";

                        let dataToken = handlerSignIn({
                            userId: response.id,
                            name: response.nome,
                            cpf: response.cpf,
                            userType: response.tipoUsuario
                        });

                        defineLoggedUser(dataToken);
                    }

                    navigate(from);
                }).catch(() => {
                    setWarning(["danger", "Não foi possível cadastrar o paciente."]);
                }).finally(() => { setIsLoading(""); });
            }
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                formRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do paciente inválidos."]);
            setIsLoading("");
        }
    }

    DocumentTitle("Paciente | CM");

    return (
        <>
            <h1>{isEdition ? "Editar" : "Cadastrar"} paciente</h1>

            <Form
                ref={formRef}
                onSubmit={submitPatientForm}
                className="form-data"
            >
                <h2>Informações pessoais</h2>

                <FieldInput
                    name='name'
                    label='Nome'
                    placeholder='Coloque o nome'
                />

                <MaskInput
                    name='cpf'
                    label='CPF'
                    mask="999.999.999-99"
                    maskChar=""
                    placeholder='000.000.000-00'
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
                    options={_genderTypes.map(x => ({
                        value: x,
                        label: getValueGenero(x)
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
                    isLoading={isLoading === "form" || isLoading === "get"}
                    type='submit'
                    color={isEdition ? "warning" : "secondary"}
                />
            </Form>
        </>
    );
}

export default Patient;