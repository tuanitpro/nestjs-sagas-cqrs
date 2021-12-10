import { v4 as uuidv4 } from 'uuid';

export class MessagingPayload {
  eventId: string;

  payload: any;

  broadcastOn: Date = new Date();

  constructor(payload: any) {
    this.eventId = uuidv4();
    this.payload = payload;
    this.broadcastOn = new Date();
  }
}
