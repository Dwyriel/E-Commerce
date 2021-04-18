export class Purchases {
    userId: string;
    itens: { productID: string, amount: number }[];
    date: Date;
}
