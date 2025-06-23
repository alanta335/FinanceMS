import React from 'react';
import { render } from '@testing-library/react';
import EmployeeManagement from '../EmployeeManagement';

describe('EmployeeManagement', () => {
  it('renders without crashing', () => {
    render(<EmployeeManagement />);
  });
});
