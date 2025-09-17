import { ValidationError } from './validation.error';

describe('validation error', () => {
  it('should create a instance of validation error without options', () => {
    const errorInstance = new ValidationError();

    expect(errorInstance).toBeInstanceOf(ValidationError);
  });

  it('should create a instance of validation error with options', () => {
    const mockInput = {
      id: 'some-id',
    };

    const errorInstance = new ValidationError({
      details: {
        input: mockInput,
      },
    });

    expect(errorInstance).toBeInstanceOf(ValidationError);
    expect(errorInstance.details).toEqual({ input: mockInput });
  });
});
