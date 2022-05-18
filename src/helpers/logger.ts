export const getLogger = () => {
  // TODO: Udate to use Datadog, LogDNA or similar
  return {
    log: (msg: string) => {
      console.log(msg);
    },
    error: (err: any, msg: string, source?: string) => {
      // TODO: source is not used
      console.error(msg, err);
    }
  }
}