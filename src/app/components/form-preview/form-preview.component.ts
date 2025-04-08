import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormBuilderService } from '../../services/form-builder.service';
import { FormField, ValidationRule } from '../../models/form-field.model';

@Component({
  selector: 'app-form-preview',
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.css']
})
export class FormPreviewComponent implements OnInit, OnDestroy {
  formFields: FormField[] = [];
  dynamicForm!: FormGroup;
  subscription!: Subscription;
  formSubmitted = false;
  formData: any = null;
  
  constructor(
    private fb: FormBuilder,
    private formBuilderService: FormBuilderService
  ) { }

  ngOnInit(): void {
    this.dynamicForm = this.fb.group({});
    
    this.subscription = this.formBuilderService.formFields$.subscribe(fields => {
      this.formFields = fields;
      this.buildForm();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

// In form-preview.component.ts
// Update the buildForm method:

buildForm(): void {
  // Reset the form
  this.dynamicForm = this.fb.group({});
  
  // Add controls based on form fields
  this.formFields.forEach(field => {
    const validators = this.getValidators(field.validations);
    
    if (field.type === 'checkbox' && field.options && field.options.length > 1) {
      // For checkbox groups, create a FormArray with a FormControl for each option
      const checkboxArray = this.fb.array([]);
      this.dynamicForm.addControl(field.id, checkboxArray);
      
      field.options.forEach(option => {
        checkboxArray.push(this.fb.control(false));
      });
    } else {
      // For other field types, create a regular FormControl
      this.dynamicForm.addControl(field.id, this.fb.control(field.value || '', validators));
    }
  });
}

  getValidators(validations: ValidationRule[]) {
    const validatorsList: any[] = [];
    
    validations.forEach(validation => {
      switch (validation.name) {
        case 'required':
          validatorsList.push(Validators.required);
          break;
        case 'minLength':
          validatorsList.push(Validators.minLength(parseInt(validation.value)));
          break;
        case 'maxLength':
          validatorsList.push(Validators.maxLength(parseInt(validation.value)));
          break;
        case 'pattern':
          validatorsList.push(Validators.pattern(validation.value));
          break;
        case 'email':
          validatorsList.push(Validators.email);
          break;
      }
    });
    
    return validatorsList;
  }

  getErrorMessage(fieldId: string, validations: ValidationRule[]): string {
    const control = this.dynamicForm.get(fieldId);
    
    if (control && control.errors && (control.dirty || control.touched)) {
      const errors = control.errors;
      
      for (const validation of validations) {
        if (errors[validation.name.toLowerCase()]) {
          return validation.message || `${validation.name} validation failed`;
        }
      }
    }
    
    return '';
  }

  onSubmit(): void {
    if (this.dynamicForm.valid) {
      this.formData = this.dynamicForm.value;
      console.log('Form Data:', this.formData);
      this.formSubmitted = true;
      
      // Reset form after 3 seconds
      setTimeout(() => {
        this.formSubmitted = false;
      }, 3000);
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.dynamicForm.controls).forEach(key => {
        const control = this.dynamicForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  removeField(id: string): void {
    this.formBuilderService.removeField(id);
  }
}
