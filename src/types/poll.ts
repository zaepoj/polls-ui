export interface PollOption {
  id: string;
  value: string;
  type: string;
}

export interface Poll {
  id: string;
  title: string;
  options: PollOption[];
}
