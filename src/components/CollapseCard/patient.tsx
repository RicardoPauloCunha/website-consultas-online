import { formatCellphone, formatCpf } from "../../util/formatString";

import { AccordionBody, AccordionHeader, UncontrolledAccordion } from "reactstrap";
import { CollapseCardEl } from "./styles";
import DataText from "../DataText";

type PatientCollapseCardProps = {
    cpf: string;
    name: string;
    contact: string;
    address: string;
}

const PatientCollapseCard = ({ cpf, name, contact, address }: PatientCollapseCardProps) => {
    return (
        <UncontrolledAccordion open="">
            <CollapseCardEl className={`collapse-card-patient collapse-card-color-gray`}>
                <AccordionHeader targetId={cpf}>
                    {`${name} - ${formatCpf(cpf)}`}
                </AccordionHeader>

                <AccordionBody accordionId={cpf}>
                    <DataText
                        label="Contato"
                        value={formatCellphone(contact)}
                    />

                    <DataText
                        label="Endereço"
                        value={address}
                    />
                </AccordionBody>
            </CollapseCardEl>
        </UncontrolledAccordion>
    );
}

export default PatientCollapseCard;