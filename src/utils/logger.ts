type LogLevel = "debug" | "log" | "error" | "warn" | "silent";

class Logger {
  static readonly DEFAULT_LEVEL: LogLevel = "log";

  static readonly VALID_LOG_LEVELS: LogLevel[] = [
    "debug",
    "log",
    "warn",
    "error",
    "silent",
  ];

  static readonly ENV_LEVEL: LogLevel = Logger.getValidLogLevel("debug");

  currentLevel: LogLevel;

  constructor() {
    this.currentLevel = this.getStoredLogLevel() || Logger.ENV_LEVEL;
    console.log("Current log level:", this.currentLevel);
  }

  private static getValidLogLevel(level: LogLevel | undefined): LogLevel {
    return Logger.VALID_LOG_LEVELS.includes(level!)
      ? level!
      : Logger.DEFAULT_LEVEL;
  }

  private canLog(level: LogLevel): boolean {
    const levelHierarchy: LogLevel[] = [
      "debug",
      "log",
      "warn",
      "error",
      "silent",
    ];
    return (
      levelHierarchy.indexOf(level) >= levelHierarchy.indexOf(this.currentLevel)
    );
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private logMessage(level: LogLevel, ...args: any): void {
    if (this.canLog(level) && level !== "silent") {
      const logFunction = console[level] || console.log;
      logFunction(`[${this.getTimestamp()}]`, ...args);
    }
  }

  debug = (...args: any): void => this.logMessage("debug", ...args);
  log = (...args: any): void => this.logMessage("log", ...args);
  warn = (...args: any): void => this.logMessage("warn", ...args);
  error = (...args: any): void => this.logMessage("error", ...args);
  silent = (...args: any): void => {};

  setLogLevel(level: LogLevel): void {
    this.currentLevel = Logger.getValidLogLevel(level);
    try {
      localStorage.setItem("logLevel", this.currentLevel);
    } catch {
      console.warn("Error accessing localStorage");
    }
  }

  private getStoredLogLevel(): LogLevel {
    try {
      const storedLevel = localStorage.getItem("logLevel") as LogLevel;
      return Logger.getValidLogLevel(storedLevel);
    } catch {
      return Logger.ENV_LEVEL;
    }
  }
}

export const logger = new Logger();
