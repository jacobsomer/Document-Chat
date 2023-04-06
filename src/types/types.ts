export type DataSourceType = 'youtube' | 'pdf'
export type DataSourceRepresentation = {
    id: string
    type: DataSourceType
    url: string
    title: string
}

export type Chunk = {
    text: string;
    start: number;
    end: number;
    embedding: number[];
}

export type MediaRequestBody = {
  name: string;
  extension: string;
  fileData: string;
};


export type PDFTextResponse = {
  pdfText: Array<Array<number | string>>;
  url: string;
};
