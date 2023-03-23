import UniqueEntityId from "../../../@seedwork/domain/unique-entity-id.vo";

export type CategoryProperties = {
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
};

export class Category {
  constructor(
    public readonly props: CategoryProperties,
    public readonly id?: UniqueEntityId
  ) {
    this.id = id || new UniqueEntityId();
    this.description = this.props.description;
    this.props.isActive = this.props.isActive ?? true;
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  private set description(value: string) {
    this.props.description = value ?? null;
  }

  private set isActive(value: boolean) {
    this.props.isActive = value ?? true;
  }

  get isActive() {
    return this.props.isActive;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
