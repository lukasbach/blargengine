export class GameTickScheduler {
  private static ticksPerSecond: number;
  private static _currentTick: number;
  private static listeners: Array<(tickNo: number, second: number) => void | null> = [];

  public static get currentTick() {
    return this._currentTick;
  }

  public static setTicksPerSecond(ticksPerSecond: number) {
    this.ticksPerSecond = ticksPerSecond;
  }

  public static increaseTick() {
    this._currentTick++;
  }

  public static scheduleEveryTicks(ticks: number, handler: (tickNo: number, second: number) => void) {
    const index = this.listeners.length;

    this.listeners.push(handler);

    return () => this.listeners.map((l, i) => i === index ? null : l);
  }

  public static scheduleEverySeconds(seconds: number, handler: (tickNo: number, second: number) => void) {
    return this.scheduleEveryTicks(seconds / this.ticksPerSecond, handler);
  }
}