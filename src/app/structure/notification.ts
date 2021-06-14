export class AppNotification {
    id: string;
    text: string;
    url: string;
    userId: string;
    from: NotificationType;
    date: Date;
    icon: string;

    equals(notification: AppNotification) {
        return this.url == notification.url && this.from == notification.from && this.text == notification.text;
    }

    equalsSmallParams(url: string, from: NotificationType, text: string) {
        return this.url == url && this.from == from && this.text == text;
    }
}

export enum NotificationType {
    chat,
    newSoldItem,
    boughtItemChanged,
    advertVerified,
    advertNewQuestion,
    advertNewAnwser
}

export function GetIconForNotification(item: NotificationType) {
    switch (item) {
        case NotificationType.chat:
            return "chatbox-ellipses";
        case NotificationType.newSoldItem:
            return "pricetags";
        case NotificationType.boughtItemChanged:
            return "bag-handle";
        case NotificationType.advertVerified:
            return "pricetag";
        case NotificationType.advertNewQuestion:
            return "newspaper";
        case NotificationType.advertNewAnwser:
            return "document-text";
        default:
            return null;
    }
}

export function NewAppNotification(text: string, url: string, notificationFor: string, from: NotificationType) {
    var notification = new AppNotification();
    notification.text = text;
    notification.url = url;
    notification.userId = notificationFor;
    notification.from = from;
    return notification;
}
