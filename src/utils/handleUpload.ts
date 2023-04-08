/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const handleObjectUploadURL = "https://docuchat-extract-fhpwesohfa-ue.a.run.app/createEmbeddingForObject"

export const handleObjectUpload = async (url: string, userID: string): Promise<string>  => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: url,
      userID: userID,
    }),
  };
  try {
    const response = await fetch(
      "https://docuchat-extract-fhpwesohfa-ue.a.run.app/createEmbeddingForObject",
      options
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return "error"
  }
};