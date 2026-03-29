/**
 * Lightweight structured logger for test execution output.
 * Outputs to stdout/stderr with ISO timestamp for CI log parsing.
 */
export const logger = {
  info: (message: string): void => {
    process.stdout.write(`[INFO] ${new Date().toISOString()} — ${message}\n`);
  },
  warn: (message: string): void => {
    process.stdout.write(`[WARN] ${new Date().toISOString()} — ${message}\n`);
  },
  error: (message: string): void => {
    process.stderr.write(`[ERROR] ${new Date().toISOString()} — ${message}\n`);
  },
};
