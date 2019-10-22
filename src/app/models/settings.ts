import {JsonObject, JsonProperty} from 'ta-json';

export class Settings {
  /** Орг ID */
  @JsonProperty('org_id')
  orgId: string;
  /** Время начала рассылки*/
  @JsonProperty('start_time')
  startTime: string;
  /** Время конца рассылки */
  @JsonProperty('end_time')
  endTime: string;
  /** Частота рассылки */
  @JsonProperty('frequency')
  idFrequency: string;
  /** Дни рассылки */
  @JsonProperty('week')
  week: string;
  /** Очки полученные за пропуск */
  @JsonProperty('points_empty')
  pointsEmpty = 0;
  /** Очки за верный ответ */
  @JsonProperty('points_correct')
  pointsCorrect = 0;
  /** Очки за неверный ответ */
  @JsonProperty('points_fail')
  pointsFail = 0;
  /** Сколько раз показывать вопрос */
  @JsonProperty('repeat_counter')
  repeatCounter = 0;

  constructor(orgId?: string,
              startTime?: string,
              endTime?: string,
              idFrequency?: string,
              week?: string,
              pointsEmpty?: number,
              pointsCorrect?: number,
              pointsFail?: number,
              repeatCounter?: number) {
    this.orgId = orgId;
    this.startTime = startTime;
    this.endTime = endTime;
    this.idFrequency = idFrequency;
    this.week = week;
    this.pointsEmpty = pointsEmpty;
    this.pointsCorrect = pointsCorrect;
    this.pointsFail = pointsFail;
    this.repeatCounter = repeatCounter;
  }
}

@JsonObject()
export class Frequency {
  /** id */
  @JsonProperty('id')
  id: string;
  /** Мои очки */
  @JsonProperty('name')
  name: string;
  /** Мои очки */
  @JsonProperty('frequency')
  frequency = 0;

  constructor(id?: string,
              name?: string,
              frequency?: number) {
    this.id = id;
    this.name = name;
    this.frequency = frequency;
  }
}
