export function parseId(value: string | string[] | undefined): number {
  if (Array.isArray(value) || !value) {
    throw new Error("Invalid id");
  }

  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid id");
  }

  return id;
}
