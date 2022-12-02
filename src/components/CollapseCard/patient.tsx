import { AccordionBody, AccordionHeader, UncontrolledAccordion } from "reactstrap";
import { formatCellphone, formatCpf } from "../../util/formatString";
import DataText from "../DataText";
import { CollapseCardEl } from "./styles";

type PatientCollapseCardProps = {
    alterColor?: boolean;
    cpf: string;
    name: string;
    contact: string;
    address: string;
}

const PatientCollapseCard = ({ alterColor, cpf, name, contact, address }: PatientCollapseCardProps) => {
    return (
        <UncontrolledAccordion open="">
            <CollapseCardEl className={`collapse-card-patient ${alterColor ? "collapse-card-color-gray" : ""}`}>
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