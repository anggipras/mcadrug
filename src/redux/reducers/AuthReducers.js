const INITIAL_STATE = {
    username: '',
    email: '',
    password: '',
    id: 0,
    isLogin: false,
    isSaved: false,
    thxBtn: false,
    isLoading: false,
    error: '',
}

export default (state=INITIAL_STATE, action)=> {
    switch (action.type) {
        case 'LOGIN':
            return {...state,...action.payload, isLogin: true, isLoading: false}
        case 'SAVEDATA':
            return {...state,...action.payload, isSaved: true}
        case 'DISABLEDBTN':
            return {...state, isSaved: false}
        case 'REGISTER':
            return {...state,...action.payload, isLogin: true, isLoading: false, thxBtn: true}
        case 'LOGOUT':
            return INITIAL_STATE
        case 'LOADING':
            return {...state, isLoading: true}
        case 'ERROR':
            return {...state, error: action.payload, isLoading: false}
        default:
            return state
    }
}