import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import DoctorSchedulesMenu from './components/Menu/doctorSchedules';
import ManagerMenu from './components/Menu/manager';
import SchedulingMenu from './components/Menu/scheduling';
import ScrollToTop from './components/ScrollToTop';
import { useAuth } from './contexts/auth';
import { userIsAuth } from './localStorages/auth';
import DoctorSchedules from './pages/DoctorSchedules';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import PatientAttendances from './pages/PatientAttendances';
import RegisterScheduling from './pages/RegisterScheduling';
import RegisterUser from './pages/RegisterUser';
import Schedules from './pages/Schedules';
import Users from './pages/Users';
import TipoUsuarioEnum from './services/enums/tipoUsuario';

type RequireAuthProps = {
    userType: TipoUsuarioEnum;
    children: React.ReactNode;
}

const RequireAuth = ({ userType, children }: RequireAuthProps): JSX.Element => {
    let location = useLocation();

    let { userIsChecked, loggedUser } = useAuth();

    if (loggedUser?.userType === userType || (!userIsChecked && userIsAuth()))
        return <>{children}</>;

    return <Navigate
        to="/login"
        replace
        state={{
            from: location,
            message: "Você não tem autorização para acessar essa página."
        }}
    />;
}

const PagesRoutes = () => {
    return (
        <ScrollToTop>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<Login />} />
                    <Route path="login" element={<Login />} />

                    <Route path="funcionarios" element={<ManagerMenu />}>
                        <Route path="listar" element={<RequireAuth userType={TipoUsuarioEnum.Gerente} children={<Users />} />} />
                        <Route path="cadastrar" element={<RequireAuth userType={TipoUsuarioEnum.Gerente} children={<RegisterUser />} />} />
                        <Route path=":userId/editar" element={<RequireAuth userType={TipoUsuarioEnum.Gerente} children={<RegisterUser />} />} />

                        <Route path="medicos">
                            <Route path="cadastrar" element={<RequireAuth userType={TipoUsuarioEnum.Gerente} children={<RegisterUser />} />} />
                            <Route path=":doctorId/editar" element={<RequireAuth userType={TipoUsuarioEnum.Gerente} children={<RegisterUser />} />} />
                        </Route>
                    </Route>

                    <Route path="agendamentos" element={<SchedulingMenu />}>
                        <Route path="listar" element={<RequireAuth userType={TipoUsuarioEnum.Recepcionista} children={<Schedules />} />} />
                        <Route path="cadastrar" element={<RequireAuth userType={TipoUsuarioEnum.Recepcionista} children={<RegisterScheduling />} />} />
                    </Route>

                    <Route path="consultas" element={<DoctorSchedulesMenu />}>
                        <Route path="listar" element={<RequireAuth userType={TipoUsuarioEnum.Medico} children={<DoctorSchedules />} />} />
                    </Route>

                    <Route path="pacientes" element={<DoctorSchedulesMenu />}>
                        <Route path=":patientCpf/atendimentos" element={<RequireAuth userType={TipoUsuarioEnum.Medico} children={<PatientAttendances />} />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </ScrollToTop>
    )
}

export default PagesRoutes;