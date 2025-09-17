import z from 'zod';

function formatZodError(zodIssues: z.core.$ZodIssue[]): Record<string, string> {
  const errorList = zodIssues.map((issue) => {
    if (issue.code === 'unrecognized_keys') {
      return [issue.keys[0] as unknown as string, 'field is not allowed'];
    }

    return [issue.path[0] as unknown as string, 'field value is invalid'];
  });

  const errors = Object.fromEntries(errorList) as Record<string, string>;
  return errors;
}

export { formatZodError };
