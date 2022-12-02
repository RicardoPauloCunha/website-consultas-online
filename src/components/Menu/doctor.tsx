import { NavLink as Link, Outlet } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';

const DoctorMenu = () => {
    return (
        <>
            <Nav
                tabs
                className="mb-4"
            >
                <NavItem>
                    <NavLink
                        to="/medicos/cadastrar"
                        tag={Link}
                    >
                        Cadastrar médico
                    </NavLink>
                </NavItem>
            </Nav>

            <Outlet />
        </>
    );
}

export default DoctorMenu;