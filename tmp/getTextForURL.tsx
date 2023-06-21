export type textResponse =
  | { pdfText: Array<[number, string]> }
  | { text: string };
type FetchOptions = {
  method: 'POST';
  headers: { 'Content-Type': 'application/json' };
  body: string;
};

export async function fetchTextForUrl(url: string): Promise<textResponse> {
  const isPdf = url.endsWith('.pdf');
  const endpoint = isPdf ? 'getTextForPDF' : 'getTextForURL';
  const options: FetchOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  };
  const response = await fetch(
    `https://chat-boba-extract-fhpwesohfa-ue.a.run.app/${endpoint}`,
    options
  );
  const data = (await response.json()) as textResponse;
  return data;
}
