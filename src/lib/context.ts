import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = await client.index("ai-sakha");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    // console.log("this is namespace", namespace); // [works]
    const queryResult = await namespace.query({
      topK: 7,
      vector: embeddings,
      // includeValues: true,
      includeMetadata: true,
    });
    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  // console.log("this is query embeddings", queryEmbeddings); // [works]
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
  // console.log("this are matches", matches); // [works]

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.3
  );

  // console.log("this are qualifyingDocs", qualifyingDocs); // [fails] for 0.7 but will work for 0.3

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  // 5 vectors
  console.log("this are docs", docs.join("\n").substring(0, 3000));
  return docs.join("\n").substring(0, 3000);
}
