import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { IMessage } from '../models/message.model';
import { ISession } from '../models/session.model';
import { MessagingService } from '../services/messaging.service';
import { StorageService } from '../services/storage.service';
import { MessageComponent } from './message/message.component';
import { MessageDirective } from './message/message.directive';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  @ViewChild(MessageDirective, { static: true }) messageHost!: MessageDirective;

  newMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private messagingService: MessagingService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit(): void {
    this.messagingService.addMessageListener();
    this.messagingService.getOldMessages().subscribe((messages: IMessage[]) => messages.forEach(m => this.loadMessage(m)))
    this.messagingService.newMessage$.subscribe((message: IMessage) => this.loadMessage(message));
  }

  loadMessage(message: IMessage) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MessageComponent);

    const viewContainerRef = this.messageHost.viewContainerRef;

    const componentRef = viewContainerRef.createComponent<MessageComponent>(componentFactory, 0);

    componentRef.instance.message = message;
  }

  sendMessage() {
    console.log('Send message' + this.newMessage);
    this.isLoading = true;
    this.messagingService.sendMessage(this.newMessage);
    this.newMessage = '';
    this.isLoading = false;
  }

  deleteAllMessages() {
    
  }
}
