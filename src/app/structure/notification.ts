export class AppNotification {
    id: string;
    text: string;
    url: string;
    userId: string;
    from: NotificationType;
    date: Date;
}

export enum NotificationType {
    chat,
    newSoldItem,
    boughtItemChanged,
    advertVerified
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
        default:
            return null;
    }
}