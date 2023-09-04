export const registerForBootstrap = (value: string, invalid: boolean, onChange: (...event: any[]) => void, onBlur: (...event: any[]) => void) => ({
    value: value,
    isInvalid: invalid,
    onChange: onChange,
    onBlur : onBlur
});