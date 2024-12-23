import { GoogleGenerativeAI } from "@google/generative-ai";
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// async function run() {
//   const result = await model.embedContent("What is the meaning of life?");
//   console.log(result.embedding.values);
// }

// run();

export async function getEmbeddings(text: string) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    const response = await model.embedContent(text.replace(/\n/g, ""));
    return response.embedding.values as number[];
  } catch (error) {
    console.log("error calling gemini embeddings api", error);
    throw error;
  }
}

// import { GoogleGenerativeAI } from "@google/generative-ai";

// export async function getEmbeddings(text: string) {
//   try {
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
//     const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

//     const result = await model.embedContent(text.replace(/\n/g, " "));
//     return result.embedding.values as number[];
//   } catch (error) {
//     console.log("error calling Gemini embeddings API", error);
//     throw error;
//   }
// }
