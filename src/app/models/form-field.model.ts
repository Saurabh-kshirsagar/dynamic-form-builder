export interface ValidationRule {
    name: string;
    value: any;
    message: string;
}

export interface FormFieldOption {
    label: string;
    value: string;
}

export interface FormField {
    id: string;
    type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'radio';
    label: string;
    placeholder?: string;
    value?: any;
    options?: FormFieldOption[];
    validations: ValidationRule[];
}
