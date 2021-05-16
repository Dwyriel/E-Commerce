export class Purchase {
    id: string;
    userId: string;
    sellerId: string;
    state: State = State.Processando;
    item: { productID: string, amount: number };
    date: Date;
}

/**
 * Cria um novo item com certos parametros.
 * @param userId id do usuario efetuando a compra.
 * @param sellerId id do vendedor do produto.
 * @param item um objeto contentdo o id do produto e a quantidade.
 * @returns um objeto do tipo Purchase contendo todos os parametros que foram passados.
 */
export function NewPurchase(userId: string, sellerId: string, item: { productID: string, amount: number }, state: State = State.Processando) {
    var purchase = new Purchase();
    purchase.userId = userId;
    purchase.sellerId = sellerId;
    purchase.item = item;
    purchase.state = state;
    return purchase;
}

export enum State {
    Processando,
    Enviado,
    Entregue
}

/**
 * Turns a state into string.
 * @param state the state to be turned.
 */
export function StateString(state: State) {
    return (state == State.Processando) ? "Processando" : (state == State.Enviado) ? "Enviado" : (state == State.Entregue) ? "Entregue" : "Invalido";
}