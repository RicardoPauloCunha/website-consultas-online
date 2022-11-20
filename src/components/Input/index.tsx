import { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

import { FormGroup, Input, Label, InputProps, FormFeedback } from 'reactstrap';

interface FieldInputProps extends InputProps {
    name: string;
    label: string;
}

const FieldInput = ({ name, label, ...rest }: FieldInputProps) => {
    const inputRef = useRef(null);
    const { fieldName, defaultValue, registerField, error, clearError } = useField(name);

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            getValue: (ref) => {
                return ref.value;
            },
            setValue: (ref, value) => {
                ref.value = value;
            },
            clearValue: (ref) => {
                ref.value = "";
            }
        });
    }, [fieldName, registerField]);

    return (
        <FormGroup>
            <Label htmlFor={fieldName}>
                {label}
            </Label>

            <Input
                id={fieldName}
                innerRef={inputRef}
                defaultValue={defaultValue}
                invalid={error ? true : false}
                onFocus={clearError}
                {...rest}
            />

            {error && <FormFeedback>
                {error}
            </FormFeedback>}
        </FormGroup>
    );
}

export default FieldInput;