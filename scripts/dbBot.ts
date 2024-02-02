import OpenAI from "openai";
import * as dotenv from "dotenv";
import {messages} from "./prompts";
dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
	const completion = await openai.chat.completions.create({
		messages: messages,
		model: "gpt-4-1106-preview",
	});

	console.log(completion.choices[0]);
}

main();
