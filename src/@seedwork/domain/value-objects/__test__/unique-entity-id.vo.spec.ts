import InvalidUUIDError from "../../../errors/invalid-uuid.error";
import { validate as uuidValidate } from "uuid";
import UniqueEntityId from "../unique-entity-id.vo";

function spyValidateMethod() {
  return jest.spyOn(UniqueEntityId.prototype as any, "validate");
}

describe("UniqueEntityId Unit Tests", () => {
  it("should throw error when uuid is invalid", () => {
    const validateSpy = spyValidateMethod();
    expect(() => new UniqueEntityId("fake id")).toThrow(new InvalidUUIDError());
    expect(validateSpy).toHaveBeenCalled();
  });

  it("should accept an uuid passed in constructor", () => {
    const validateSpy = spyValidateMethod();
    const uuid = "d0738a51-f6e6-4943-964c-5191edc1900b";
    const vo = new UniqueEntityId(uuid);
    expect(vo.value).toBe(uuid);
    expect(validateSpy).toHaveBeenCalled();
  });

  it("should accept an uuid passed in constructor", () => {
    const validateSpy = spyValidateMethod();
    const uuid = "d0738a51-f6e6-4943-964c-5191edc1900b";
    const vo = new UniqueEntityId(uuid);
    expect(uuidValidate(vo.value)).toBe(true);
    expect(validateSpy).toHaveBeenCalled();
  });
});
