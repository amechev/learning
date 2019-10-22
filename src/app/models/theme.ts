import {JsonProperty} from 'ta-json';

export class Theme {
  /** id */
  @JsonProperty('id')
  id: string;
  /** Заголовок темы */
  @JsonProperty('name')
  name: string;
  /** Активна ли она */
  @JsonProperty('is_active')
  isActive = false;
  /** Всего вопросов было */
  @JsonProperty('total')
  total = 0;
  /** Правильных ответов было */
  @JsonProperty('correct')
  correct = 0;

  constructor(id?: string,
              name?: string,
              isActive?: boolean,
              total?: number,
              correct?: number) {
    this.id = id;
    this.name = name;
    this.isActive = isActive;
    this.total = total;
    this.correct = correct;
  }
}
