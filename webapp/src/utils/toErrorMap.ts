interface ApiErrorNode {
  field: string;
  error: string;
}

export function toErrorMap(errors: ApiErrorNode[]) {
  const errorMap: Record<string, string> = {};
  errors.forEach(({ field, error }) => {
    errorMap[field] = error;
  });
  return errorMap;
}
