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