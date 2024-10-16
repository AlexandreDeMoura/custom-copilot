// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'jest-extended';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-testid' });

// Add this line to properly set up jest-extended
import * as matchers from 'jest-extended';
expect.extend(matchers);
