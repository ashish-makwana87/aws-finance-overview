import { handler } from "./hello.js";

(async () => {
  try {
    const result = await handler({});
    console.log("LOCAL INVOKE RESULT:");
    console.log(result);
    if (result && result.body) {
      try {
        console.log("PARSED BODY:", JSON.parse(result.body));
      } catch (_) {
        // ignore
      }
    }
  } catch (err) {
    console.error("HANDLER THREW ERROR:");
    console.error(err);
    process.exit(1);
  }
})();
