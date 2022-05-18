import { delay } from "./helpers/time";
import { completeEticket } from "./completeEticket";

(async () => {
  await completeEticket();
  await delay(5 * 60 * 1000);
})();
