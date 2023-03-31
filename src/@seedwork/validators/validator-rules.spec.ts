import ValidationError from "../errors/validation-error";
import ValidatorRules from "./validator-rules";

type Values = {
  value: any;
  property: string;
};

type ExpectedRule = {
  value: any;
  property: string;
  rule: keyof ValidatorRules;
  error: ValidationError;
  params?: any[];
};

function assertionIsInvalid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected);
  }).toThrow(expected.error);
}

function assertionIsValid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected);
  }).not.toThrow(expected.error);
}

function runRule({
  value,
  property,
  rule,
  params = [],
}: Omit<ExpectedRule, "error">) {
  const validator = ValidatorRules.values(value, property);
  const method = validator[rule];
  // @ts-ignore
  method.apply(validator, params);
}

describe("ValidatorRules Unit Tests", () => {
  test("values method", () => {
    const validator = ValidatorRules.values("some value", "field");
    expect(validator).toBeInstanceOf(ValidatorRules);
    expect(validator["value"]).toEqual("some value");
    expect(validator["property"]).toEqual("field");
  });

  test("required validation rules", () => {
    // invalid cases
    let arrange: Values[] = [
      { value: null, property: "field" },
      { value: undefined, property: "field" },
      { value: "", property: "field" },
    ];
    const error = new ValidationError("The field is required");

    arrange.forEach((item) => {
      assertionIsInvalid({
        value: item.value,
        property: item.property,
        rule: "required",
        error,
      });
    });

    // valid cases
    arrange = [
      { value: "test", property: "field" },
      { value: 5, property: "field" },
      { value: 0, property: "field" },
      { value: false, property: "field" },
    ];

    arrange.forEach((item) => {
      assertionIsValid({
        value: item.value,
        property: item.property,
        rule: "required",
        error,
      });
    });
  });

  test("required validation rules", () => {
    let arrange: Values[] = [
      { value: 5, property: "field" },
      { value: {}, property: "field" },
      { value: false, property: "field" },
    ];
    const error = new ValidationError("The field must be a string");

    arrange.forEach((item) => {
      assertionIsInvalid({
        value: item.value,
        property: item.property,
        rule: "string",
        error,
      });
    });

    // valid cases
    arrange = [
      { value: "test", property: "field" },
      { value: null, property: "field" },
      { value: undefined, property: "field" },
    ];

    arrange.forEach((item) => {
      assertionIsValid({
        value: item.value,
        property: item.property,
        rule: "string",
        error,
      });
    });
  });

  test("maxLength validation rules", () => {
    // invalid cases
    let arrange: Values[] = [{ value: "aaaaaa", property: "field" }];
    const error = new ValidationError(
      "The field must be less or equal than 5 characters"
    );

    arrange.forEach((item) => {
      assertionIsInvalid({
        value: item.value,
        property: item.property,
        rule: "maxLength",
        error,
        params: [5],
      });
    });

    // valid cases
    arrange = [
      { value: "aaaaa", property: "field" },
      { value: null, property: "field" },
      { value: undefined, property: "field" },
    ];

    arrange.forEach((item) => {
      assertionIsValid({
        value: item.value,
        property: item.property,
        rule: "maxLength",
        error,
        params: [5],
      });
    });
  });

  test("boolean validation rules", () => {
    // invalid cases
    let arrange: Values[] = [
      { value: 5, property: "field" },
      { value: "true", property: "field" },
      { value: "false", property: "field" },
    ];
    const error = new ValidationError("The field must be a boolean");

    arrange.forEach((item) => {
      assertionIsInvalid({
        value: item.value,
        property: item.property,
        rule: "boolean",
        error,
      });
    });

    // valid cases
    arrange = [
      { value: false, property: "field" },
      { value: true, property: "field" },
      { value: null, property: "field" },
      { value: undefined, property: "field" },
    ];

    arrange.forEach((item) => {
      assertionIsValid({
        value: item.value,
        property: item.property,
        rule: "boolean",
        error,
      });
    });
  });

  it("should throw a validation error when combining two or more validation rules", () => {
    let validator = ValidatorRules.values(null, "field");
    expect(() => validator.required().string().maxLength(5)).toThrow(
      new ValidationError("The field is required")
    );

    validator = ValidatorRules.values(5, "field");
    expect(() => validator.required().string().maxLength(5)).toThrow(
      new ValidationError("The field must be a string")
    );

    validator = ValidatorRules.values("aaaaaa", "field");
    expect(() => validator.required().string().maxLength(5)).toThrow(
      new ValidationError("The field must be less or equal than 5 characters")
    );

    validator = ValidatorRules.values(null, "field");
    expect(() => validator.required().boolean()).toThrow(
      new ValidationError("The field is required")
    );

    validator = ValidatorRules.values(5, "field");
    expect(() => validator.required().boolean()).toThrow(
      new ValidationError("The field must be a boolean")
    );
  });

  it("should be valid to combine two or more validation rules", () => {
    expect.assertions(0);
    ValidatorRules.values("test", "field").required().string();
    ValidatorRules.values("aaaaa", "field").required().string().maxLength(5);

    ValidatorRules.values(true, "field").required().boolean();
    ValidatorRules.values(false, "field").required().boolean();
  });
});
