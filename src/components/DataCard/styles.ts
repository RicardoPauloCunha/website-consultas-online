import styled from "styled-components";

export const DataCardEl = styled.div`
    width: 100%;
    background-color: var(--color-white-100);
    border: solid 1px var(--color-gray-100);
    padding: 1.5rem 2rem;
    border-radius: 0.25rem;

    display: grid;
    gap: 0.5rem 1rem;

    & + & {
        margin-top: 1rem;
    }

    >div {
        &:first-child {
            grid-area: name;

            b {
                font-size: 1.1rem;
            }
        }
    }

    button {
        margin: 0 0 0 auto;
        height: 2.5rem;
        padding: 0.4rem 1rem !important;
    }

    &.data-card-attendance {
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, auto);
        grid-template-areas:
        "name serv doct"
        "desc desc desc";

        >div {
            &:nth-child(2) {
                grid-area: serv;
            }

            &:nth-child(3) {
                grid-area: doct;
            }

            &:nth-child(4) {
                grid-area: desc;
            }
        }
    }

    &.data-card-user {
        grid-template-columns: repeat(2, 1fr) 5rem;
        grid-template-rows: repeat(1, auto);
        grid-template-areas:
        "name type butt";

        >div {
            &:nth-child(2) {
                grid-area: type;
            }
        }

        >button {
            grid-area: butt;
        }
    }

    &.data-card-scheduling {
        grid-template-columns: repeat(4, 1fr) 5rem;
        grid-template-rows: auto;
        grid-template-areas:
        "name stat serv doct butt";

        >div {
            &:nth-child(2) {
                grid-area: stat;
            }

            &:nth-child(3) {
                grid-area: serv;
            }

            &:nth-child(4) {
                grid-area: doct;
            }
        }

        >button {
            grid-area: butt;
        }
    }

    &.data-card-scheduling-doctor {
        grid-template-columns: repeat(3, 1fr) 5rem;
        grid-template-rows: auto;
        grid-template-areas:
        "name stat serv butt";

        >div {
            &:nth-child(2) {
                grid-area: stat;
            }

            &:nth-child(3) {
                grid-area: serv;
            }
        }

        >button {
            grid-area: butt;
        }
    }

    @media(max-width: 768px) {
        padding: 1rem;
        display: flex;
        flex-direction: column;
    }
`;