import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from "@aspnet/signalr"; // or from "@microsoft/signalr" if you are using a new library
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IMessage } from '../models/message.model';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private hubConnection: HubConnection;
  private newMessage: Subject<IMessage> = new Subject<IMessage>();
  private apiUrl = environment.api;

  newMessage$ = this.newMessage.asObservable();

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.apiUrl + '/MessageHub', { accessTokenFactory: () => this.authenticationService.getCurrentUser().token })
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  addMessageListener(): void {
    this.hubConnection.on('BroadcastMessage', (message) => {
      this.newMessage.next(message);
    });
  }

  sendMessage(message: string): void {
    this.hubConnection.invoke('Message', message).then(() => console.log('Message Sent'));
  }

  getOldMessages(): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(this.apiUrl + "/Messages");
  }

  deleteAllMessages(): Observable<any> {
    return this.http.delete<any>(this.apiUrl + "/Messages")
  }
}
