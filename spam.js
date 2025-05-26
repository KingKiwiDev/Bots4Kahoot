const Kahoot = require("./scripts");

async function startBots(pin, name, bot_amount, logFn = console.log) {
    let client = [];
    if (!pin || pin.trim() === "") {
        logFn("Add a proper pin!");
        return;
    }
    if (!name || name.trim() === "") {
        logFn("Name is too short!");
        return;
    }
    if (Number(bot_amount) > 200) {
        logFn("Bot count too big - less than 200 only");
        return;
    }
    if (!bot_amount || Number(bot_amount) === 0) {
        logFn("Bot amount is not a number or is 0");
        return;
    }
    logFn(`Configuring and joining ${Number(bot_amount)} bots`);
    for (let i = 0; i < Number(bot_amount); i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        logFn(`${name} (${i}) is joining`);
        client.push(new Kahoot());
        client[i].join(pin, `${name}-${i}`).catch((error) => {
            // Convert error to string for better output
            let errMsg = error && error.message ? error.message : JSON.stringify(error);
            logFn(`There was an error for bot: ${name} (${i}) -> ${errMsg}`);
        });
        client[i].on("Joined", () => {
            logFn(`${name} (${i}) has joined the Kahoot!`);
        });
        client[i].on("QuizStart", () => {
            logFn(`The quiz has started for ${name} (${i})!`);
        });
        client[i].on("QuestionStart", (question) => {
            const randomChoice = Math.floor(
                Math.random() * question.numberOfChoices
            );
            logFn(
                `A new question has started for ${name} (${i}), answering answer ${randomChoice + 1}.`
            );
            question.answer(randomChoice);
        });
        client[i].on("QuizEnd", () => {
            logFn(`The quiz has ended for ${name} (${i}).`);
        });
        client[i].on("Disconnect", (reason) => {
            logFn(`${name} (${i}) has disconnected for: ${reason}`);
        });
    }
}

module.exports = { startBots };