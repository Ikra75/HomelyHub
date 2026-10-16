import Groq from "groq-sdk";
import pkg from "dotenv";
const {config} = pkg;

config();
const groq = new Groq({
    apiKey:process.env.GROQ_API_KEY
});

export default groq;