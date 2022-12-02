import { FormHandles, SubmitHandler } from "@unform/core";
import { useEffect, useRef, useState } from "react";
import { Col, Row } from "reactstrap";
import * as Yup from "yup";
import PatientCollapseCard from "../../components/CollapseCard/patient";
import FieldInput from "../../components/Input";
import MaskInput from "../../components/Input/mask";
import SelectInput from "../../components/Input/select";
import LoadingButton from "../../components/LoadingButton";
import Warning from "../../components/Warning";
import { useAuth } from "../../contexts/auth";
import Medico from "../../services/entities/medico";
import Paciente from "../../services/entities/paciente";
import EspecialidadeEnum, { getValueEspecialidade, listEspecialidade } from "../../services/enums/especialidade";
import TipoUsuarioEnum from "../../services/enums/tipoUsuario";
import { listDoctorByParamsHttp } from "../../services/http/doctor";
import { getPatientByParamsHttp } from "../../services/http/patient";
import { postSchedulingHttp } from "../../services/http/scheduling";
import { Form } from "../../styles/components";
import DocumentTitle from "../../util/documentTitle";
import { normalizeString } from "../../util/formatString";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";

type SchedulingFormData = {
    specialty: string;
    doctorId: number;
    time: string;
    date: string;
}

const RegisterScheduling = () => {
    const formRef = useRef<FormHandles>(null);

    const { loggedUser } = useAuth();

    const _specialties = listEspecialidade();
    const _minDate = new Date().toISOString().substring(0, 10);

    const [isLoading, setIsLoading] = useState<"form" | "get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [isReceptionist, setIsReceptionist] = useState(false);

    const [doctors, setDoctors] = useState<Medico[]>([]);
    const [patient, setPatient] = useState<Paciente | undefined>(undefined);

    useEffect(() => {
        let receptionist = loggedUser?.userType === TipoUsuarioEnum.Recepcionista;
        setIsReceptionist(receptionist);
        // eslint-disable-next-line
    }, []);

    const getDoctors = (specialty: EspecialidadeEnum | undefined) => {
        listDoctorByParamsHttp({
            especialidade: specialty
        }).then(response => {
            setDoctors([...response]);
        });
    }

    const searchPatient = (cpf?: string) => {
        setWarning(["", ""]);
        formRef.current?.setFieldError("patientCpf", "");

        cpf = normalizeString(formRef.current?.getFieldValue("patientCpf"));

        if (!cpf || cpf.length !== 11) {
            formRef.current?.setFieldError("patientCpf", "O CPF do paciente está incompleto.");
            return;
        }

        setIsLoading("get");
        getPatientByParamsHttp({
            cpf
        }).then(response => {
            setPatient(response);
            setWarning(["success", "Paciente encontrado."]);
        }).catch(() => {
            setWarning(["danger", "Paciente não encontrado. Adicione o paciente para prosseguir o agendamento."]);
        }).finally(() => setIsLoading(""));
    }

    const submitSchedulingForm: SubmitHandler<SchedulingFormData> = async (data, { reset }) => {
        try {
            setIsLoading("form");
            setWarning(["", ""]);
            formRef.current?.setErrors({});

            const shema = Yup.object().shape({
                doctorId: Yup.string().trim()
                    .required("Selecione o médico que realizará a consulta."),
                specialty: Yup.string().trim()
                    .required("Selecione a especialidade da consulta."),
                time: Yup.string().trim()
                    .required("Coloque o hórario."),
                date: Yup.string()
                    .required("Coloque a data."),
            });

            await shema.validate(data, {
                abortEarly: false
            });

            let idPaciente = 0;

            if (isReceptionist) {
                let patientCpf = normalizeString(formRef.current?.getFieldValue("patientCpf"));

                if (!patientCpf || patientCpf.length !== 11) {
                    formRef.current?.setFieldError("patientCpf", "O CPF do paciente está incompleto.");
                    return;
                }

                if (patient === undefined || patient.cpf !== patientCpf) {
                    setIsLoading("");
                    setWarning(["warning", "Campos do agendamento inválidos."]);
                    formRef.current?.setFieldError("patientCpf", "Busque o paciente pelo CPF para prosseguir.");
                    return;
                }

                idPaciente = patient.id;
            }
            else {
                if (loggedUser === undefined)
                    return;

                idPaciente = loggedUser.userId;
            }

            data.doctorId = Number(data.doctorId);

            postSchedulingHttp({
                idPaciente,
                idMedico: data.doctorId,
                especialidade: data.specialty as EspecialidadeEnum,
                dataCriacao: data.date, // TODO: Data atual
                dataAgendada: data.date,
                horaAgendada: data.time
            }).then(() => {
                setWarning(["success", "Agendamento cadastrado com sucesso."]);
                setPatient(undefined);
                reset();
            }).catch(() => {
                setWarning(["danger", "Não foi possível cadastrar o agendamento."]);
            }).finally(() => { setIsLoading(""); });
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                formRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do agendamento inválidos."]);
            setIsLoading("");
        }
    }

    const handlerChangeSpecialty = (optionValue: string) => {
        let specialty = optionValue as EspecialidadeEnum;

        getDoctors(specialty);
    }

    DocumentTitle("Cadastrar agendamento | CM");

    return (
        <>
            <h1>Cadastro de agendamento</h1>

            <Form
                ref={formRef}
                onSubmit={submitSchedulingForm}
                className="form-data"
            >
                {isReceptionist && <Row>
                    <Col md={10}>
                        <MaskInput
                            name='patientCpf'
                            label='CPF do paciente'
                            placeholder='000.000.000-00'
                            mask="999.999.999-99"
                            maskChar=""
                        />
                    </Col>

                    <Col md={2}>
                        <LoadingButton
                            text="Buscar"
                            isLoading={isLoading === "get"}
                            type="button"
                            color="secondary"
                            outline
                            onClick={() => searchPatient()}
                        />
                    </Col>
                </Row>}

                {patient && <PatientCollapseCard
                    cpf={patient.cpf}
                    name={patient.nome}
                    contact={patient.contato}
                    address={patient.endereco}
                />}

                {(patient || !isReceptionist) && <>
                    <SelectInput
                        name='specialty'
                        label='Especialidade'
                        placeholder='Selecione a especialidade'
                        options={_specialties.map(x => ({
                            value: x,
                            label: getValueEspecialidade(x)
                        }))}
                        handlerChange={handlerChangeSpecialty}
                    />

                    <SelectInput
                        name='doctorId'
                        label='Médico'
                        placeholder='Selecione o médico'
                        options={doctors.map(x => ({
                            value: x.id.toString(),
                            label: x.nome
                        }))}
                    />

                    <Row>
                        <Col md={6}>
                            <FieldInput
                                name='date'
                                label='Data'
                                placeholder='Selecione a data'
                                type="date"
                                min={_minDate}
                            />
                        </Col>

                        <Col md={6}>
                            <FieldInput
                                name='time'
                                label='Horário'
                                placeholder='Selecione o horário'
                                type="time"
                                min="08:00"
                                max="16:00"
                            />
                        </Col>
                    </Row>
                </>}

                <Warning value={warning} />

                <LoadingButton
                    text="Cadastrar"
                    isLoading={isLoading === "form"}
                    type="submit"
                    color="secondary"
                />
            </Form>
        </>
    );
}

export default RegisterScheduling;