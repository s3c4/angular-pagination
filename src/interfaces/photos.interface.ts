export namespace Photos {
  // -->Create: the model interface for Photo
  export interface Photo {
    albumId: number;
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
  }
}
