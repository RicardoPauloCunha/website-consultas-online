import { NavLink as Link, Outlet } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';

const UserMenu = () => {
    return (
        <>
            <Nav
                tabs
                className="mb-4"
            >
                <NavItem>
                    <NavLink
                        to="/usuarios/listar"
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

export default UserMenu;