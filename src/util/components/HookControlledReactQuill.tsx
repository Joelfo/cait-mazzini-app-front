import * as ReactBootstrap from "react-bootstrap";
import * as HookForm from "react-hook-form";
import ReactQuill from "react-quill";

export type HookControlledReactQuillProps<FormEntityType extends HookForm.FieldValues = HookForm.FieldValues, 
    TFieldName extends HookForm.Path<FormEntityType> = HookForm.Path<FormEntityType> > =
    {
        control: HookForm.Control<FormEntityType, any>, 
        name: HookForm.FieldPath<FormEntityType>, 
        rules: Omit<HookForm.RegisterOptions<FormEntityType, HookForm.Path<FormEntityType>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>,
        modules: {
            [key: string]: any;
        } | undefined,
        defaultValue?: string
    }

export const HookControlledReactQuill = <FormEntityType extends HookForm.FieldValues = HookForm.FieldValues, 
    TFieldName extends HookForm.Path<FormEntityType> = HookForm.Path<FormEntityType> >({control, name, rules, modules, defaultValue} : 
        HookControlledReactQuillProps<FormEntityType, TFieldName>) => {
            
            return (
                <HookForm.Controller
                    control={control}
                    name={name}
                    rules={rules}
                    render={({
                        field: {onChange, onBlur, value},
                        fieldState: {invalid} 
                    }) => (
                        <>
                            <ReactQuill theme='snow' defaultValue={defaultValue} value={value} onBlur={onBlur} onChange={onChange} modules={modules}/>
                            <ReactBootstrap.Form.Control type='text' isInvalid={invalid} style={{display: 'none'}}/>
                        </>
                    )}
                />
            );
}
