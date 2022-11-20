import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { useAuth } from './contexts/auth';
import { userIsAuth } from './localStorages/auth';
import TipoUsuarioEnum from './services/enums/tipoUsuario';

import Layout from './components/Layout';
import SchedulingMenu from './components/Menu/scheduling';
import EmployeeMenu from './components/Menu/employee';
import DoctorSchedulesMenu from './components/Menu/doctorSchedules';
import ScrollToTop from './components/ScrollToTop';

import Login from './pages/Login';
import NotFound from './pages/NotFound';
import RegisterEmployee from './pages/RegisterEmployee';
import Employees from './pages/Employees';
import RegisterScheduling from './pages/RegisterScheduling';
import Schedules from './pages/Schedules';
import DoctorSchedules from './pages/DoctorSchedules';
import PatientAttendances from './pages/PatientAttendances';

type RequireAuthProps = {
    employeeType: TipoUsuarioEnum;
    children: React.ReactNode;
}

const RequireAuth = ({ employeeType, children }: RequireAuthProps): JSX.Element => {
    let location = useLocation();

    let { userIsChecked, loggedUser } = useAuth();

    if (loggedUser?.userType === employeeType || (!userIsChecked && userIsAuth()))
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

                    <Route path="funcionarios" element={<EmployeeMenu />}>
                        <Route path="listar" element={<RequireAuth employeeType={TipoUsuarioEnum.Gerente} children={<Employees />} />} />
                        <Route path="cadastrar" element={<RequireAuth employeeType={TipoUsuarioEnum.Gerente} children={<RegisterEmployee />} />} />
                        <Route path=":employeeId/editar" element={<RequireAuth employeeType={TipoUsuarioEnum.Gerente} children={<RegisterEmployee />} />} />

                        <Route path="medicos">
                            <Route path="cadastrar" element={<RequireAuth employeeType={TipoUsuarioEnum.Gerente} children={<RegisterEmployee />} />} />
                            <Route path=":doctorId/editar" element={<RequireAuth employeeType={TipoUsuarioEnum.Gerente} children={<RegisterEmployee />} />} />
                        </Route>
                    </Route>

                    <Route path="agendamentos" element={<SchedulingMenu />}>
                        <Route path="listar" element={<RequireAuth employeeType={TipoUsuarioEnum.Recepcionista} children={<Schedules />} />} />
                        <Route path="cadastrar" element={<RequireAuth employeeType={TipoUsuarioEnum.Recepcionista} children={<RegisterScheduling />} />} />
                    </Route>

                    <Route path="consultas" element={<DoctorSchedulesMenu />}>
                        <Route path="listar" element={<RequireAuth employeeType={TipoUsuarioEnum.Medico} children={<DoctorSchedules />} />} />
                    </Route>

                    <Route path="pacientes" element={<DoctorSchedulesMenu />}>
                        <Route path=":patientCpf/atendimentos" element={<RequireAuth employeeType={TipoUsuarioEnum.Medico} children={<PatientAttendances />} />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </ScrollToTop>
    )
}

export default PagesRoutes;