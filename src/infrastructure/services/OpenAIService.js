import OpenAI from "openai";
import JSON5 from "json5";
import Question from "../../models/QuestionModel.js";

export class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  async generateQuestions(selectedUnit, language = "English") {
    const systemMessage = {
      role: "system",
      content:
        `You are an assistant that generates practical exam questions in ${language} to help users practice grammar and vocabulary.`,
    };

    const userMessage = {
      role: "user",
      content: language === "jp" ? `
Based on the following **topics, vocabulary, and grammatical structures**, generate 10 multiple-choice questions for an exam. The questions should help students practice reading, vocabulary, and grammar in Japanese.

**Topics, Vocabulary, and Grammatical Structures:**

${selectedUnit}

**Requirements:**
- The word or phrase for each question must be written in Spanish (e.g., “nurse,” “name,” “eight minutes”).
- The answer options must be in Japanese (hiragana or phonetic reading).
- Generate **only three options** per question (a, b, and c).
- The options must be plausible and of similar difficulty.
- Incorrect options must be plausible and contextually related.
- **Format:** Strict JSON.
- **Structure:**
  [
    {
      "questionText": "How do you say 'eight minutes' in Japanese?",
      "options": ["はっぷん", "はちふん", "はちぶん", "はちぷん"],
      "correctAnswer": "はっぷん"
    },
    ...
  ]
- Do not include explanations, additional text, or code block markers like \`\`\`.
      ` : `
Based on the following **topics, vocabulary, and grammatical structures**, generate 10 multiple-choice fill-in-the-blank questions in ${language} for an exam. The questions should help practice language skills related to these topics.

**Topics, Vocabulary, and Grammatical Structures:**

 ${selectedUnit}
      
      **Requirements:**
      - The questions should relate only to the provided topics and structures.
      - **Both the questions and options must be written in ${language}.**
      - Each question should be a sentence with a blank space that the student needs to fill in.
      - Provide four answer options for each question, one of which is correct.
      - Incorrect options should be plausible and contextually related to the question.
      - **Format:** Strict JSON.
      - **Structure:**
        [
          {
            "questionText": "She ____ a teacher at the local school.",
            "options": ["is", "are", "am", "be"],
            "correctAnswer": "is"
          },
          ...
        ]
      
      - Do not include explanations, additional text, or code block markers like \`\`\`.
      - Return only the JSON, unformatted, in a single line, without line breaks or unnecessary spaces.
      - Do not wrap the JSON in quotes.
      `,
    };

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [systemMessage, userMessage],
        max_tokens: 1500,
        temperature: 0.7,
      });

      const textResponse = response.choices[0].message.content.trim();
      const questionsData = JSON5.parse(textResponse);

      const isValidQuestion = (q) =>
        q.questionText &&
        q.options &&
        q.options.length >= 3 &&
        q.correctAnswer &&
        q.options.includes(q.correctAnswer);

      return questionsData.filter(isValidQuestion);
    } catch (error) {
      console.error("Error generating questions:", error);
      throw new Error("Failed to generate questions.");
    }
  }
}
