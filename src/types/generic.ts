export interface HTMLEvent {
  target: HTMLInputElement;
}

export interface Response<T> {
  data: T;
}

export interface FetchError {
  error?: { code: number };
}
