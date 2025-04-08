import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormBuilderService } from '../../services/form-builder.service';
import { FormField, ValidationRule, FormFieldOption } from '../../models/form-field.model';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css']
})
export class FormBuilderComponent implements OnInit {
  fieldForm!: FormGroup;
  fieldTypes = ['text', 'textarea', 'dropdown', 'checkbox', 'radio'];
  validationTypes = ['required', 'minLength', 'maxLength', 'pattern', 'email'];
  options: FormFieldOption[] = [];
  validations: ValidationRule[] = [];
  
  constructor(
    private fb: FormBuilder,
    private formBuilderService: FormBuilderService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.fieldForm = this.fb.group({
      type: ['text', Validators.required],
      label: ['', Validators.required],
      placeholder: [''],
      validationType: [''],
      validationValue: [''],
      validationMessage: [''],
      optionLabel: [''],
      optionValue: ['']
    });
  }

  get hasOptions(): boolean {
    const type = this.fieldForm.get('type')?.value;
    return type === 'dropdown' || type === 'checkbox' || type === 'radio';
  }

  addOption(): void {
    const label = this.fieldForm.get('optionLabel')?.value;
    const value = this.fieldForm.get('optionValue')?.value;
    
    if (label && value) {
      this.options.push({ label, value });
      this.fieldForm.patchValue({
        optionLabel: '',
        optionValue: ''
      });
    }
  }

  removeOption(index: number): void {
    this.options.splice(index, 1);
  }

  addValidation(): void {
    const name = this.fieldForm.get('validationType')?.value;
    const value = this.fieldForm.get('validationValue')?.value;
    const message = this.fieldForm.get('validationMessage')?.value;
    
    if (name) {
      this.validations.push({ name, value, message });
      this.fieldForm.patchValue({
        validationType: '',
        validationValue: '',
        validationMessage: ''
      });
    }
  }

  removeValidation(index: number): void {
    this.validations.splice(index, 1);
  }

  addField(): void {
    const newField: FormField = {
      id: Date.now().toString(),
      type: this.fieldForm.get('type')?.value,
      label: this.fieldForm.get('label')?.value,
      placeholder: this.fieldForm.get('placeholder')?.value,
      options: this.hasOptions ? [...this.options] : undefined,
      validations: [...this.validations]
    };
    
    this.formBuilderService.addField(newField);
    this.resetForm();
  }

  resetForm(): void {
    this.initForm();
    this.options = [];
    this.validations = [];
  }
}
