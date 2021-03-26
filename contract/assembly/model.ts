import { PersistentMap } from 'near-sdk-as';

@nearBindgen
export class Message {
  constructor(
    public blockTimestamp: u64,
    public accountIdFrom: string,
    public accountIdTo: string,
    public text: string,
  ) {}
}

export const map = new PersistentMap<string, Message[]>('m');
