import { ReactNode } from "react";
import * as ReactBootstrap from "react-bootstrap";
import * as HookForm from "react-hook-form";

export type HookControlledFormSelectProps<FormEntityType extends HookForm.FieldValues = HookForm.FieldValues, 
    TFieldName extends HookForm.Path<FormEntityType> = HookForm.Path<FormEntityType> > =
    {
        control: HookForm.Control<FormEntityType, any>, 
        name: HookForm.FieldPath<FormEntityType>,
        rules: Omit<HookForm.RegisterOptions<FormEntityType, HookForm.Path<FormEntityType>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
        children: ReactNode;
    }

export const HookControlledFormSelect = <FormEntityType extends HookForm.FieldValues = HookForm.FieldValues, 
    TFieldName extends HookForm.Path<FormEntityType> = HookForm.Path<FormEntityType> >({control, name, rules, children} : 
        HookControlledFormSelectProps<FormEntityType, TFieldName>) => {
    return (
        <HookForm.Controller
            control={control}
            name={name}
            rules={rules}
            render={({
                field: {onChange, onBlur, value},
                fieldState: {invalid} 
            }) => (
                <ReactBootstrap.FormSelect
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    isInvalid={invalid} 
                >
                    {children}
                </ReactBootstrap.FormSelect>
            )}
        />
    )
}