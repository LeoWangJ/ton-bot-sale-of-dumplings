import { HttpApi, fromNano, toNano } from 'ton'

export async function verifyTransactionExistance(toWallet, amount, comment) {
    const endpoint = process.env.NETWORK === 'mainnet' ? "https://toncenter.com/api/v2/jsonRPC" : "https://testnet.toncenter.com/api/v2/jsonRPC";
    const httpClient = new HttpApi(endpoint, {}, { apiKey: process.env.TONCENTER_TOKEN })
    const transactions = await httpClient.getTransactions(toWallet, { limit: 100 })
    let incomingTransactions = transactions.filter(tx => Object.keys(tx.out_msgs).length === 0)

    for (let i = 0; i < incomingTransactions.length; i++) {
        let tx = incomingTransactions[i]
        if (!tx.in_msg.msg_data.text) {
            continue;
        }

        let txValue = fromNano(tx.in_msg.value)
        let txComment = tx.in_msg.message

        if (txComment === comment && txValue === amount.toString()) {
            return true
        }
    }
    return false
}

export function generatePaymentLink(toWallet, amount, comment, app) {
    let domain = app === 'tonhub' ? `https://tonhub.com` : `https://app.tonkeeper.com`
    if (app == 'tonhub') {
        return `${domain}/transfer/${toWallet}?amount=${toNano(amount)}&text=${comment}`;
    }
    return `${domain}/transfer/${toWallet}?amount=${toNano(amount)}&text=${comment}`;
}