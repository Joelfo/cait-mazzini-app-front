import { Fragment, useEffect, useRef } from "react"
import { Form } from "react-bootstrap"
import { Control, Controller, FieldValues, RegisterOptions, useFormContext } from "react-hook-form"
import ReactQuill from "react-quill"
import { QUILL_DEFAULT_MODULES } from "util/QuillDefaultModules"
import { justRequiredRule } from "util/validation"

type ControlledReactQuillProps = {
    name: string,
    label: string,
    rules?: Omit<RegisterOptions<FieldValues, string>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"> | undefined
}

export const ControlledReactQuill = ({ name, label, rules } : ControlledReactQuillProps) => {
    const { control, formState: { errors } } = useFormContext();
    const quillRef = useRef<ReactQuill | null>(null);

    useEffect(() => {
        if (!!errors[name]) {
            quillRef.current?.getEditor().focus();
            quillRef.current?.getEditingArea().scrollIntoView();
        }
    }, [errors[name]])

    return (
        <Fragment>
            <Form.Label>
                {label}
            </Form.Label>
            <Controller
                control={control}
                name={name}
                rules={rules}
                render={
                    ({
                        field : { onChange, onBlur, value, ref },
                        fieldState: { invalid }
                    }) => (
                        <Fragment>
                            <ReactQuill modules={QUILL_DEFAULT_MODULES} style={ invalid ? {border: '1px solid red', borderRadius: '5px'} : {} } ref={(el) => quillRef.current = el} id='quill-321' value={value} onChange={onChange} onBlur={onBlur} theme='snow' />
                            {
                                !!errors[name]
                                &&
                                <p style={{color:'red'}}> {errors[name]!.message?.toString()} </p>
                            }
                        </Fragment>
                    )
                }
            />
            <Form.Control.Feedback type={'invalid'}>{errors[name]?.message?.toString()}</Form.Control.Feedback>
        </Fragment>
    )
}