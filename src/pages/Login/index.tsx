import { FormHandles, SubmitHandler } from '@unform/core';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import FieldInput from '../../components/Input';
import LoadingButton from '../../components/LoadingButton';
import Warning from '../../components/Warning';
import { useAuth } from '../../contexts/auth';
import { getLoggedUser, handlerSignIn } from '../../localStorages/auth';
import Usuario from '../../services/entities/usuario';
import TipoUsuarioEnum from '../../services/enums/tipoUsuario';
import { getPatientByIdHttp } from '../../services/http/patient';
import { getUserByIdHttp, postLoginUserHttp } from '../../services/http/user';
import { Form } from '../../styles/components';
import DocumentTitle from '../../util/documentTitle';
import { WarningTuple } from '../../util/getHttpErrors';
import getValidationErrors from '../../util/getValidationErrors';

type LocationData = {
    from: Location;
    message: string;
}

type LoginFormData = {
    email: string;
    password: string;
}

const Login = () => {
    const formRef = useRef<FormHandles>(null);
    const navigate = useNavigate();

    const { defineLoggedUser } = useAuth();

    const location = useLocation()?.state as LocationData;
    const message = location?.message || "";

    const [isLoading, setIsLoading] = useState<"form" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(location?.message ? ["warning", message] : ["", ""]);

    useEffect(() => {
        let user = getLoggedUser();

        if (user) {
            if (user.userType === TipoUsuarioEnum.Paciente)
                getPacient(user.userId);
            else
                getUser(user.userId);
        }
        // eslint-disable-next-line
    }, []);

    const getUser = async (userId: number) => {
        await getUserByIdHttp(userId).then(response => {
            handlerLogin(response);
        });
    }

    const getPacient = async (userId: number) => {
        await getPatientByIdHttp(userId).then(response => {
            handlerLogin(response, response.cpf);
        });
    }

    const submitLoginForm: SubmitHandler<LoginFormData> = async (data) => {
        try {
            setIsLoading("form");
            setWarning(["", ""]);
            formRef.current?.setErrors({});

            const shema = Yup.object().shape({
                email: Yup.string().trim()
                    .email("E-mail inválido.")
                    .required("Coloque o email da sua conta."),
                password: Yup.string().trim()
                    .required("Coloque a senha da sua conta.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            await postLoginUserHttp({
                email: data.email,
                senha: data.password
            }).then(response => {
                if (response.tipoUsuario === TipoUsuarioEnum.Paciente)
                    getPacient(response.id);
                else
                    handlerLogin(response);
            }).catch(() => {
                setWarning(["danger", "Email ou senha inválida."]);
            }).finally(() => { setIsLoading(""); });
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                formRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos inválidos."]);
            setIsLoading("");
        }
    }

    const handlerLogin = (user: Usuario, cpf?: string) => {
        if (!cpf)
            cpf = "";

        let dataToken = handlerSignIn({
            userId: user.id,
            name: user.nome,
            cpf,
            userType: user.tipoUsuario
        });

        let from = "";

        switch (user.tipoUsuario) {
            case TipoUsuarioEnum.Gerente:
                from = "/usuarios/listar";
                break;
            case TipoUsuarioEnum.Recepcionista:
                from = "/agendamentos/listar";
                break;
            case TipoUsuarioEnum.Medico:
                from = "/consultas/listar";
                break;
            case TipoUsuarioEnum.Paciente:
                from = "/meus-agendamentos/listar";
                break;
        }

        defineLoggedUser(dataToken);
        navigate(from, { replace: true });
    }

    DocumentTitle("Login | CM");

    return (
        <>
            <h1>Login</h1>

            <Form
                ref={formRef}
                onSubmit={submitLoginForm}
                className="form-data"
            >
                <FieldInput
                    name='email'
                    label='E-mail'
                    placeholder='Coloque seu email'
                    type="email"
                />

                <FieldInput
                    name='password'
                    label='Senha'
                    placeholder='Coloque sua senha'
                    type="password"
                />

                <Warning value={warning} />

                <LoadingButton
                    text="Entrar"
                    isLoading={isLoading === "form"}
                    type="submit"
                    color="secondary"
                />
            </Form>
        </>
    );
}

export default Login;