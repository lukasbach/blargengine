export class TimeBox<STEPDATA extends object> {
  private steps: STEPDATA[];

  public get numberOfSteps() {
    return this.steps.length;
  }

  constructor(initialStep?: STEPDATA) {
    this.steps = [];

    if (initialStep) {
      this.storeStep(initialStep);
    }
  }

  public storeStep(data: STEPDATA) {
    this.steps.push(data);
  }

  public reset() {
    this.steps = [];
  }

  public popStep(): STEPDATA {
    this.steps.pop();
    return this.steps[this.numberOfSteps - 1];
  }
}