import test from "node:test";
import assert from "node:assert/strict";
import {
  validateAgainstSchema,
  type SchemaNode,
} from "../src/schema-validator.js";
const strict: SchemaNode = {
  type: "object",
  properties: { public: { type: "string" } },
  required: ["public"],
  additionalProperties: false,
};
for (const name of Object.getOwnPropertyNames(Object.prototype)) {
  test(`strict schema rejects an undeclared own ${name} field`, () => {
    const input = { public: "known" };
    Object.defineProperty(input, name, { value: "private", enumerable: true });
    const issues = validateAgainstSchema(input, strict);
    assert.deepEqual(issues, [
      {
        path: `$.${name}`,
        message: "property is not allowed by additionalProperties: false",
      },
    ]);
  });
}
test("strict own-property rejection recurses through refs, objects and arrays", () => {
  const root = { components: { schemas: { Item: strict } } };
  const schema: SchemaNode = {
    type: "object",
    properties: {
      rows: { type: "array", items: { $ref: "#/components/schemas/Item" } },
    },
  };
  assert.deepEqual(
    validateAgainstSchema(
      { rows: [{ public: "known", toString: "private" }] },
      schema,
      "$",
      root,
    ),
    [
      {
        path: "$.rows[0].toString",
        message: "property is not allowed by additionalProperties: false",
      },
    ],
  );
});
test("an inherited value does not satisfy a required own JSON field", () => {
  assert.deepEqual(
    validateAgainstSchema(Object.create({ public: "inherited" }), strict),
    [{ path: "$.public", message: "required property is missing" }],
  );
});
test("explicitly declared prototype-named properties are still validated as ordinary own fields", () => {
  const properties = JSON.parse('{"toString":{"type":"string"}}');
  const schema: SchemaNode = {
    type: "object",
    properties,
    required: ["toString"],
    additionalProperties: false,
  };
  assert.deepEqual(validateAgainstSchema({ toString: "explicit" }, schema), []);
  assert.equal(
    validateAgainstSchema({ toString: 42 }, schema)[0].message,
    "expected type string, received number",
  );
  assert.equal(
    validateAgainstSchema({}, schema)[0].message,
    "required property is missing",
  );
});
test("additionalProperties true and schema-valued behavior remain explicit", () => {
  assert.deepEqual(
    validateAgainstSchema(
      { toString: "permitted" },
      { type: "object", additionalProperties: true },
    ),
    [],
  );
  assert.deepEqual(
    validateAgainstSchema(
      { toString: 42 },
      { type: "object", additionalProperties: { type: "string" } },
    ),
    [{ path: "$.toString", message: "expected type string, received number" }],
  );
});
