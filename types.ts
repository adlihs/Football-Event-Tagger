
export enum Period {
  FIRST_HALF = 'First Half',
  SECOND_HALF = 'Second Half',
}

export enum Outcome {
  SUCCESSFUL = 'Successful',
  UNSUCCESSFUL = 'Unsuccessful',
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface FootballEvent {
  id: number;
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
  action: string;
  player: string;
  team: string;
  minute: number;
  period: Period;
  outcome: Outcome;
}
