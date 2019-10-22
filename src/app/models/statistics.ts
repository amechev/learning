import {JsonElementType, JsonObject, JsonProperty} from 'ta-json';
import {UserShort} from './user';

@JsonObject()
export class Statistics {
  /** id юзеря */
  @JsonProperty('user_id')
  userId: string = null;
  /** Пользователь */
  @JsonProperty('user')
  @JsonElementType(UserShort)
  user: UserShort;
  /** Верные ответы */
  @JsonProperty('correct_answers')
  correct = 0;
  /** Всего вопросов */
  @JsonProperty('total_answers')
  total = 0;
  /** ЗАработано очков */
  @JsonProperty('points')
  points = 0;

  constructor(userId?: string,
              user?: UserShort,
              correct?: number,
              total?: number,
              points?: number) {
    this.userId = userId,
    this.user = user;
    this.correct = correct;
    this.total = total;
    this.points = points;
  }
}

@JsonObject()
export class StatisticsByUser {
  /** id  */
  @JsonProperty('id')
  id: string = null;
  /** Имя темы */
  @JsonProperty('name')
  name: string = null;
  /** Правильно отвечено */
  @JsonProperty('correct')
  correct = 0;
  /** Всего ответов */
  @JsonProperty('total')
  total = 0;

  constructor(id?: string,
              name?: string,
              correct?: number,
              total?: number) {
    this.id = id,
    this.name = name;
    this.correct = correct;
    this.total = total;
  }
}

@JsonObject()
export class StatisticsByUserByTheme {
  /** id  */
  @JsonProperty('id')
  id: string = null;
  /** Имя темы */
  @JsonProperty('name')
  name: string = null;
  /** Правильно отвечено */
  @JsonProperty('correct')
  correct = 0;
  /** Всего ответов */
  @JsonProperty('total')
  total = 0;

  constructor(id?: string,
              name?: string,
              correct?: number,
              total?: number) {
    this.id = id,
      this.name = name;
    this.correct = correct;
    this.total = total;
  }
}


@JsonObject()
export class MyResult {
  /** Моя позиция */
  @JsonProperty('my_rating')
  myRating: number;
  /** Мои очки */
  @JsonProperty('points')
  points = 0;

  constructor(myRating?: number,
              points?: number) {
    this.myRating = myRating;
    this.points = points;
  }
}
