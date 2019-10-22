import {JsonElementType, JsonProperty} from 'ta-json';
import {Question} from './question';

export class Testing {
  /** answer_option */
  @JsonProperty('answer_option')
  answerOption: string;
  /** Правильный ответ */
  @JsonProperty('correct_answer')
  correctAnswer: string;
  /** Имя темы */
  @JsonProperty('theme_name')
  themeName: string;
  /** Идентификатор */
  @JsonProperty('id')
  id: string;
  /** Текущий ли это вопрос */
  @JsonProperty('current')
  current: boolean = false;
  /** Очков за ответ */
  @JsonProperty('points')
  points: string;
  /** Вопрос в текущем тестировании */
  @JsonProperty('question')
  @JsonElementType(Question)
  question: Question;

  constructor(answerOption?: string,
              correctAnswer?: string,
              themeName?: string,
              id?: string,
              current?: boolean,
              points?: string,
              question?: Question) {
    this.answerOption = answerOption,
      this.correctAnswer = correctAnswer,
      this.themeName = themeName,
      this.id = id,
      this.current = current,
      this.points = points,
      this.question = question;
  }
}
