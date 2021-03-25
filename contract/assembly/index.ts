import { Context, PersistentMap } from 'near-sdk-as';

@nearBindgen
export class Message {
  constructor(
    public blockIndex: u64,
    public accountIdFrom: string,
    public accountIdTo: string,
    public text: string
  ) {}    
};

const map = new PersistentMap<string, Message[]>("m");

export function sendMessage(accountIdTo: string, text: string): void {
  const messages = map.get(accountIdTo, [])!;
  messages.push(new Message(Context.blockIndex, Context.sender, accountIdTo, text));
  map.set(accountIdTo, messages);
};

export function getMessages(accountId: string): Message[] {
  return map.get(accountId, [])!;
};

export function deleteMessage(accountIdTo: string, id: i32): void {
  const messages = map.get(accountIdTo, [])!;
  const mes1 = messages.slice(0, id);
  const mes2 = messages.slice(id + 1);
  const updatedMessages = mes1.concat(mes2);
  map.set(accountIdTo, updatedMessages);
};

export function deleteAllMessages(accountIdTo: string): void {
  map.set(accountIdTo, []);
};
