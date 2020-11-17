export const OpenModal = (cartData) => {
    return {
        type: 'OPENMOD',
        cart: cartData
    }
}

export const CloseModal = () => {
    return {
        type: 'CLOSEMOD'
    }
}

export const AcceptPrice = () => {
    return {
        type: 'ACCEPTPRICE'
    }
}

export const LessPrice = () => {
    return {
        type: 'LESSPRICE'
    }
}