export enum Period {
  FIRST_HALF = 'First Half',
  SECOND_HALF = 'Second Half',
}

export enum Outcome {
  SUCCESSFUL = 'Successful',
  UNSUCCESSFUL = 'Unsuccessful',
}

export enum Action {
  Pass = 'Pass',
  Shot = 'Shot',
  Dribble = 'Dribble',
  Tackle = 'Tackle',
  Interception = 'Interception',
  FoulCommitted = 'Foul Committed',
  Clearance = 'Clearance',
  Cross = 'Cross',
  Header = 'Header',
  Save = 'Save',
  Goal = 'Goal',
  Assist = 'Assist',
  CornerKick = 'Corner Kick',
  FreeKick = 'Free Kick',
  PenaltyKick = 'Penalty Kick',
  ThrowIn = 'Throw-in',
  Offside = 'Offside',
  Card = 'Card',
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
  action: Action;
  player: string;
  team: string;
  minute: string; // Changed from number to string for "mm:ss" format
  period: Period;
  outcome: Outcome;
}