import { Container } from "reactstrap";
import styled from "styled-components";

export const LayoutEl = styled(Container)`
    padding-top: 6rem;
    padding-bottom: 6rem;

    max-width: 1024px !important;

    @media(max-width: 768px) {
        padding-top: 5rem;
        padding-bottom: 3rem;
    }
`;