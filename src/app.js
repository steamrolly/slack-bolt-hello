const { App, ExpressReceiver } = require("@slack/bolt");

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: receiver
});

receiver.app.get("/", (_, res) => {
  res.status(200).send("Hello World! from bolt");
});

app.message(/^help$/, ({ say }) => {
  say(`Available Message: URL, help, debug`);
});

app.message("hello", ({ message, say }) => {
  say(
    `Hey there <@${message.user}>!\nYour message.user is ${JSON.stringify(
      message.user
    )}`
  );
});

app.message("debug", ({ message, payload, body, say }) => {
  say(`body : ${JSON.stringify(body, "", 4)}`);
  say(
    `payload : ${
      JSON.stringify(payload) === JSON.stringify(body.event) ? "" : "NOT"
    } equals body.event\n` +
      `message : ${
        JSON.stringify(message) === JSON.stringify(payload) ? "" : "NOT"
      } equals payload`
  );
});

app.error(error => {
  console.error(error);
});

(async () => {
  await app.start(process.env.PORT || 8080);
  console.log("⚡️ Bolt app is running!");
})();
