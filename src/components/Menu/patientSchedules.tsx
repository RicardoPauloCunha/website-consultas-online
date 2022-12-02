import { NavLink as Link, Outlet } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';

const PatientSchedulesMenu = () => {
    return (
        <>
            <Nav
                tabs
                className="mb-4"
            >
                <NavItem>
                    <NavLink
                        to="/meus-agendamentos/listar"
                        tag={Link}
                    >
                        Listar
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink
                        to="/meus-agendamentos/cadastrar"
                        tag={Link}
                    >
                        Cadastrar
                    </NavLink>
                </NavItem>
            </Nav>

            <Outlet />
        </>
    );
}

export default PatientSchedulesMenu;