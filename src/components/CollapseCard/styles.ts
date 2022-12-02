import { AccordionItem } from "reactstrap";
import styled from "styled-components";

export const CollapseCardEl = styled(AccordionItem)`
    background-color: var(--color-white-0);
    margin-bottom: 1rem;

    h2 {
        margin: 0;
    }

    .accordion-button {
        font-weight: 500;
        font-size: 1rem;
        color: var(--color-black-100);
        background-color: var(--color-white-0);
        box-shadow: none;
    }

    .accordion-button:not(.collapsed) {
        border-bottom: solid 1px var(--color-gray-100);
    }

    .accordion-body {
        display: grid;
        gap: 0.5rem 1rem;
    }

    &.collapse-card-color-gray {
        .accordion-button {
            background-color: var(--color-white-100);
        }

        .accordion-button:not(.collapsed) {
            background-color: var(--color-white-100);
        }

        .accordion-body {
            background-color: var(--color-white-100);
        }
    }

    &.collapse-card-patient {
        .accordion-body {
            grid-template-columns: 10rem 1fr 7rem;
            grid-template-rows: auto;
            grid-template-areas:
            "cont addr butt";

            >div {
                &:nth-child(1) {
                    grid-area: cont;
                }

                &:nth-child(2) {
                    grid-area: addr;
                }
            }

            >button {
                grid-area: butt;
                margin: 0 0 0 auto;
                height: 2.5rem;
                padding: 0.4rem 1rem !important;
            }
        }
    }

    @media(max-width: 768px) {
        margin-top: 2rem;
        
        .accordion-body {
            display: flex;
            flex-direction: column;
        }
        
        .collapse-card-color-gray {
            margin-top: 0;
        }
    }
`;