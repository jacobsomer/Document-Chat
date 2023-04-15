/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const handleObjectUploadURL = "https://docuchat-extract-fhpwesohfa-ue.a.run.app/createEmbeddingForObject"


type response = {
    docId: string;
    error: string;
  }

export const handleObjectUpload = async (url: string, docId: string): Promise<response>  => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
       url,
       docId,
    }),
  };
  try {
    const response = await fetch(
      "https://docuchat-extract-fhpwesohfa-ue.a.run.app/createEmbeddingForObject",
      options
    );
    const resp = await response.json();
    return resp
  } catch (err ) {
    let message = 'Unknown Error'
    if (err instanceof Error) message = err.message
    return { error: message }  as response;
  }
};