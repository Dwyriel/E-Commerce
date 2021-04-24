export class Purchases {
    id: string;
    userId: string;
    itens: { productID: string, amount: number }[];
    date: Date;
}
