import {JsonElementType, JsonObject, JsonProperty} from 'ta-json';

@JsonObject()
export class AnswerOption {
  /** Идентификатор */
  @JsonProperty('id')
  id: string;
  /** Заголовок ответа */
  @JsonProperty('name')
  name: string;
  /** Врный ли это ответ */
  @JsonProperty('correct_answer')
  correctAnswer = false;

  constructor(id?: string,
              name?: string,
              correctAnswer?: boolean) {
    id ? this.id = id : null;
    this.name = name;
    this.correctAnswer = correctAnswer;
  }
}


@JsonObject()
export class Question {
  /** id*/
  @JsonProperty('id')
  id: string;
  /** id*/
  @JsonProperty('theme')
  theme: string;
  /** Название темы */
  @JsonProperty('theme_name')
  themeName: string;
  /** Заголовок вопроса */
  @JsonProperty('name')
  name: string;
  /** Описание */
  @JsonProperty('description')
  description: string;
  /** Включен ли вопрос в тестирование */
  @JsonProperty('is_active')
  isActive = false;
  /** Доступный для ответа в текущий момент */
  @JsonProperty('current')
  current = false;
  /** Сколько за него получено баллов */
  @JsonProperty('points')
  points: number | null = null;
  /** Мой ответ ID */
  @JsonProperty('my_answer_id')
  myAnswerId: string | null = null;
  /** Сколько раз задан */
  @JsonProperty('total')
  total: number;
  /** Верных ответов */
  @JsonProperty('correct')
  correct: number;
  /** Список ответов на вопрос */
  @JsonProperty('answers_options')
  @JsonElementType(AnswerOption)
  answerOptions: AnswerOption[];

  constructor(id?: string,
              theme?: string,
              themeName?: string,
              name?: string,
              description?: string,
              total?: number,
              correct?: number,
              isActive?: boolean,
              points?: number,
              myAnswerId?: string,
              answerOptions?: AnswerOption[]) {
    this.id = id;
    this.theme = theme;
    this.themeName = themeName;
    this.name = name;
    this.description = description;
    this.total = total;
    this.correct = correct;
    this.isActive = isActive;
    this.points = points;
    this.myAnswerId = myAnswerId;
    this.answerOptions = answerOptions;
  }
}

