import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormField } from '../models/form-field.model';

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {
  private formFields = new BehaviorSubject<FormField[]>([]);
  formFields$ = this.formFields.asObservable();

  constructor() { }

  addField(field: FormField): void {
    const currentFields = this.formFields.getValue();
    this.formFields.next([...currentFields, field]);
  }

  updateField(updatedField: FormField): void {
    const currentFields = this.formFields.getValue();
    const updatedFields = currentFields.map(field => 
      field.id === updatedField.id ? updatedField : field
    );
    this.formFields.next(updatedFields);
  }

  removeField(fieldId: string): void {
    const currentFields = this.formFields.getValue();
    this.formFields.next(currentFields.filter(field => field.id !== fieldId));
  }

  getCurrentFields(): FormField[] {
    return this.formFields.getValue();
  }

  clearForm(): void {
    this.formFields.next([]);
  }
}
