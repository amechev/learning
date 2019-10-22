import {JsonObject, JsonProperty} from 'ta-json';

/**
 * Модель краткого представления пользователя
 */
@JsonObject()
export class UserShort {
  /** Уникальный идентификатор */
  @JsonProperty()
  id: string;
  /** Имя */
  @JsonProperty('first_name')
  firstName: string;
  /** Отчество, если есть */
  @JsonProperty('middle_name')
  middleName?: string;
  /** Фамилия */
  @JsonProperty('last_name')
  lastName: string;

  constructor(id?: string, firstName?: string, middleName?: string, lastName?: string) {
    this.id = id;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
  }
}

@JsonObject()
export class User extends UserShort {
}
