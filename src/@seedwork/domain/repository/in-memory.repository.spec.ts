import Entity from "../entity/entity";
import NotFoundError from "../errors/not-found.error";
import UniqueEntityId from "../value-objects/unique-entity-id.vo";
import InMemoryRepository from "./in-memory.repository";

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe("InMemoryRepository Unit Tests", () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  it("should insert a new entity", async () => {
    const entity = new StubEntity({ name: "name", price: 5 });
    await repository.insert(entity);
    expect(entity.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  it("should throw an error when entity not found", () => {
    expect(repository.findById("id")).rejects.toThrow(
      new NotFoundError("Entity not found using ID id")
    );
    expect(
      repository.findById(
        new UniqueEntityId("8374bbbe-4c84-46cd-8eae-d243f40df7cd")
      )
    ).rejects.toThrow(
      new NotFoundError(
        "Entity not found using ID 8374bbbe-4c84-46cd-8eae-d243f40df7cd"
      )
    );
  });

  it("should find an entity by id", async () => {
    const entity = new StubEntity({ name: "name", price: 5 });
    await repository.insert(entity);
    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should find all entities", async () => {
    const entity = new StubEntity({ name: "name", price: 5 });
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toStrictEqual([entity]);
  });

  it("should throws an error on updating a non existing entity", () => {
    const entity = new StubEntity({ name: "name", price: 5 });
    expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });

  it("should update an entity", async () => {
    const entity = new StubEntity({ name: "name", price: 5 });
    await repository.insert(entity);
    const entityUpdated = new StubEntity(
      { name: "updated", price: 1 },
      entity.uniqueEntityId
    );
    await repository.update(entityUpdated);
    expect(entityUpdated.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  it("should throws an error on deleting a non existing entity", () => {
    expect(repository.delete("id")).rejects.toThrow(
      new NotFoundError("Entity not found using ID id")
    );
    expect(
      repository.delete(
        new UniqueEntityId("8374bbbe-4c84-46cd-8eae-d243f40df7cd")
      )
    ).rejects.toThrow(
      new NotFoundError(
        "Entity not found using ID 8374bbbe-4c84-46cd-8eae-d243f40df7cd"
      )
    );
  });

  it("should delete an entity", async () => {
    const entity = new StubEntity({ name: "name", price: 5 });
    await repository.insert(entity);
    await repository.delete(entity.id);
    expect(repository.items).toHaveLength(0);

    await repository.insert(entity);
    await repository.delete(entity.uniqueEntityId);
    expect(repository.items).toHaveLength(0);
  });
});
