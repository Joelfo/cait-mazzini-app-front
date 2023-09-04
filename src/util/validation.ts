export const requiredTextMessage = (fieldName : string) => `O campo ${fieldName} é obrigatório`;

export const justRequiredRule = (fieldName : string) => ({
    required: {
        value: true,
        message: requiredTextMessage(fieldName)
    }
})