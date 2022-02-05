export interface PollOption {
  id: string;
  value: string;
  type: string;
}

export interface PollOptionWithCount extends PollOption {
  count: number;
}

export interface Poll {
  id: string;
  title: string;
  options: PollOption[];
}

export interface PollResult extends Poll {
  options: PollOptionWithCount[];
}
