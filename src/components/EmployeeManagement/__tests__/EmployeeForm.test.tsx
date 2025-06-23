import React from 'react';
import { render } from '@testing-library/react';
import EmployeeForm from '../EmployeeForm';
import { initialEmployee } from '../employeeUtils';

describe('EmployeeForm', () => {
  it('renders without crashing', () => {
    render(
      <EmployeeForm
        employee={initialEmployee}
        setEmployee={() => {}}
        positions={[]}
        departments={[]}
        onSubmit={() => {}}
        onCancel={() => {}}
        submitLabel="Test"
      />
    );
  });
});
