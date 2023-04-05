import {
  EntityValidationError,
  ValidationError,
} from "../../../@seedwork/domain/errors/validation-error";
import { Category } from "./category";

describe("Category Integration Tests", () => {
  describe("create method", () => {
    it("should be an invalid category using name property", () => {
      expect(() => {
        new Category({ name: null });
      }).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => {
        new Category({ name: "" });
      }).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => {
        new Category({ name: 5 as any });
      }).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => {
        new Category({ name: "t".repeat(256) });
      }).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should be an invalid category using description property", () => {
      expect(() => {
        new Category({ description: 5 } as any);
      }).containsErrorMessages({
        description: ["description must be a string"],
      });
    });

    it("should be an invalid category using isActive property", () => {
      expect(() => {
        new Category({ isActive: 5 } as any);
      }).containsErrorMessages({
        isActive: ["isActive must be a boolean value"],
      });
    });

    it("should be a valid category", () => {
      expect.assertions(0);
      new Category({
        name: "Movie",
      });
      new Category({
        name: "Movie",
        description: "description",
      });
      new Category({
        name: "Movie",
        description: null,
      });
      new Category({
        name: "Movie",
        description: "description",
        isActive: false,
      });
      new Category({
        name: "Movie",
        description: "description",
        isActive: true,
      });
    });
  });

  describe("update method", () => {
    it("should be an invalid category using name property", () => {
      const category = new Category({ name: "Movie" });
      expect(() => {
        category.update(null, null);
      }).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => {
        category.update("", null);
      }).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => {
        category.update(5 as any, null);
      }).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => {
        category.update("a".repeat(256), null);
      }).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should be an invalid category using description property", () => {
      const category = new Category({ name: "Movie" });
      expect(() => {
        category.update(null, 5 as any);
      }).containsErrorMessages({
        description: ["description must be a string"],
      });
    });

    it("should be a valid category", () => {
      expect.assertions(0);
      const category = new Category({
        name: "Movie",
      });
      category.update("Changed name", null);
      category.update("Changed name", "some description");
    });
  });
});
