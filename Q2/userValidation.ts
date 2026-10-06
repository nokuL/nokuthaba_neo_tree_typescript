
export type UserInput = {
  name?: string;
  age?: unknown;
  email?: string;
  phone?: string;
};

export function createUser(input: UserInput): UserInput {
  if (!input.name || input.name.trim() === "") throw new Error("name is required");

  if (!input.email || input.email.trim() === "") throw new Error("email is required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) throw new Error("email must be valid");

  if (input.age === undefined || input.age === null || input.age === "") throw new Error("age is required");
  if (typeof input.age !== "number" || !Number.isInteger(input.age) || input.age < 18) {
    throw new Error("Age must be a whole number from 18 upwards");
  }

  for (const field of Object.keys(input)) {
    if (!["name", "email", "age", "phone"].includes(field)) throw new Error(`unknown field "${field}"`);
  }

  return {name : input.name , email : input.email, age : input.age};
}

export function updateUser(input: UserInput): UserInput {
  if (input.name !== undefined && input.name.trim() === "") throw new Error("name is required");

  if (input.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) throw new Error("email must be valid");

  if (input.age !== undefined && (typeof input.age !== "number" || !Number.isInteger(input.age) || input.age < 18)) {
    throw new Error("Age must be a whole number from 18 upwards");
  }

  for (const field of Object.keys(input)) {
    if (!["name", "email", "age", "phone"].includes(field)) throw new Error(`unknown field "${field}"`);
  }

  return input;
}

export function importUser(row: Record<string, string>): UserInput {
  return createUser({ ...row, age: row.age ? Number(row.age) : undefined });
}


