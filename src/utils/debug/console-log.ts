export const ConsoleLog = (whatever: any) =>
  import.meta.env.DEV && console.log(whatever);
