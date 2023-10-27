import * as ReactBootstrap from "react-bootstrap";
import * as HookForm from "react-hook-form";

export type HookControlledFormControlProps<FormEntityType extends HookForm.FieldValues = HookForm.FieldValues, 
    TFieldName extends HookForm.Path<FormEntityType> = HookForm.Path<FormEntityType> > =
    {
        control: HookForm.Control<FormEntityType, any>, 
        name: HookForm.FieldPath<FormEntityType>, 
        formControlType: string,
        rules: Omit<HookForm.RegisterOptions<FormEntityType, HookForm.Path<FormEntityType>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>
    }

export const HookControlledFormControl = <FormEntityType extends HookForm.FieldValues = HookForm.FieldValues, 
    TFieldName extends HookForm.Path<FormEntityType> = HookForm.Path<FormEntityType> >({control, name, formControlType, rules} : 
        HookControlledFormControlProps<FormEntityType, TFieldName>) => {
    return (
        <HookForm.Controller
            control={control}
            name={name}
            rules={rules}
            render={({
                field: {onChange, onBlur, value},
                fieldState: {invalid} 
            }) => (
                <ReactBootstrap.FormControl type={formControlType} value={value} onChange={onChange} onBlur={onBlur} isInvalid={invalid} />
            )}
        />
    )
}
