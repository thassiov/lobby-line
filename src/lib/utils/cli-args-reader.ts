type ParsedArgs = Record<string, string | boolean>;

function parseCliFlags(argv: string[]): ParsedArgs {
  const args = argv.slice(2); // skip node + script
  const parsed: ParsedArgs = {};

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < args.length; i++) {
    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
    const arg = args[i] as string;

    if (arg.startsWith('--')) {
      const [key, value] = arg.split('=') as [string, unknown];

      if (value !== undefined) {
        parsed[key.slice(2)] = value as string;
      } else {
        // is the thing have no value, just assume it is boolean and thats it
        parsed[key.slice(2)] = true;
      }
    }
  }

  return parsed;
}

export { parseCliFlags };
