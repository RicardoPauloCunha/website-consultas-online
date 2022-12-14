import { NavLink as Link, Outlet } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';

const DoctorSchedulesMenu = () => {
    return (
        <>
            <Nav
                tabs
                className="mb-4"
            >
                <NavItem>
                    <NavLink
                        to="/consultas/listar"
                        tag={Link}
                    >
                        Listar
                    </NavLink>
                </NavItem>
            </Nav>

            <Outlet />
        </>
    );
}

export default DoctorSchedulesMenu;