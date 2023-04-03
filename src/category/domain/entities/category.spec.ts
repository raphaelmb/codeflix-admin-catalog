import { Category, CategoryProperties } from "./category";
import { omit } from "lodash";
import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";

describe("Category Unit Test", () => {
  beforeEach(() => {
    Category.validate = jest.fn();
  });

  test("constructor of category", () => {
    let category = new Category({
      name: "Movie",
    });
    let props = omit(category.props, "createdAt");
    expect(Category.validate).toHaveBeenCalled();
    expect(props).toStrictEqual({
      name: "Movie",
      description: null,
      isActive: true,
    });
    expect(category.props.createdAt).toBeInstanceOf(Date);

    let createdAt = new Date();
    category = new Category({
      name: "Movie",
      description: "description",
      isActive: false,
    });

    expect(category.props).toStrictEqual({
      name: "Movie",
      description: "description",
      isActive: false,
      createdAt,
    });

    category = new Category({
      name: "Movie",
      description: "description",
    });
    expect(category.props).toMatchObject({
      name: "Movie",
      description: "description",
    });

    category = new Category({
      name: "Movie",
      isActive: true,
    });
    expect(category.props).toMatchObject({
      name: "Movie",
      isActive: true,
    });

    createdAt = new Date();
    category = new Category({
      name: "Movie",
      createdAt,
    });
    expect(category.props).toMatchObject({
      name: "Movie",
      createdAt,
    });
  });

  test("id field", () => {
    type CategoryData = { props: CategoryProperties; id?: UniqueEntityId };
    const data: CategoryData[] = [
      { props: { name: "Movie" } },
      { props: { name: "Movie" }, id: null },
      { props: { name: "Movie" }, id: undefined },
      { props: { name: "Movie" }, id: new UniqueEntityId() },
    ];

    data.forEach((item) => {
      const category = new Category(item.props, item.id);
      expect(category.id).toBeDefined();
      expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    });
  });

  test("getter and setter of name prop", () => {
    const category = new Category({ name: "Movie" });
    expect(category.name).toEqual("Movie");

    category["name"] = "other name";
    expect(category.name).toBe("other name");
  });

  test("getter and setter of description prop", () => {
    let category = new Category({ name: "Movie", description: "description" });
    expect(category.description).toEqual("description");

    category = new Category({ name: "Movie" });
    expect(category.description).toBeNull();

    category = new Category({ name: "Movie" });
    category["description"] = "description";
    expect(category.description).toEqual("description");

    category["description"] = undefined;
    expect(category.description).toBeNull();

    category["description"] = null;
    expect(category.description).toBeNull();
  });

  test("getter and setter of isActive prop", () => {
    let category = new Category({ name: "Movie" });
    expect(category.isActive).toBe(true);

    category = new Category({ name: "Movie", isActive: true });
    expect(category.isActive).toBe(true);

    category = new Category({ name: "Movie", isActive: false });
    expect(category.isActive).toBe(false);
  });

  test("getter of createdAt prop", () => {
    let category = new Category({ name: "Movie" });
    expect(category.createdAt).toBeInstanceOf(Date);

    let createdAt = new Date();
    category = new Category({ name: "Movie", createdAt });
    expect(category.createdAt).toBe(createdAt);
  });

  test("update name and description", () => {
    const category = new Category({
      name: "Movie",
      description: "A good movie",
    });
    category.update("Other movie", "A bad movie");
    expect(Category.validate).toHaveBeenCalledTimes(2);
    expect(category.name).toBe("Other movie");
    expect(category.description).toBe("A bad movie");
  });

  test("change isActive status", () => {
    const category = new Category({
      name: "Movie",
    });
    category.deactivate();
    expect(category.isActive).toBe(false);
    category.activate();
    expect(category.isActive).toBe(true);
  });
});
