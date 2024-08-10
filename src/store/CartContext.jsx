import { act, createContext, useReducer } from "react";


const CartContext = createContext({
    items: [],
    addItem: (item) => {},
    removeItem: (id) => {},
    clearCart: () => {},
})


function cartReducer(state, action){

    if(action.type === 'ADD_ITEM'){
     const existingCartItemIndex = state.items.findIndex((item) => item.id === action.item.id)

     const updatedItems = [...state.items];

     if(existingCartItemIndex > -1){
        // iif item alrady there then just +1 quantity
        const exisitingItem = state.items[existingCartItemIndex];  
        const updatedItem = {
            ...exisitingItem,
            quantity: exisitingItem.quantity + 1
        }
        updatedItems[existingCartItemIndex] = updatedItem; 
     }else{
        // when adding 1st time item in cart
        updatedItems.push({ ...action.item, quantity: 1 });
     }

     return { ...state, items: updatedItems };
    }
    if(action.type === 'REMOVE_ITEM'){

        const existingCartItemIndex = state.items.findIndex((item) => item.id === action.id)

        const updatedItems = [...state.items];

        const existingCartItem = state.items[existingCartItemIndex];

        if(existingCartItem.quantity === 1){

            updatedItems.splice(existingCartItemIndex, 1);
        }else{
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity - 1,
            }
            updatedItems[existingCartItemIndex] = updatedItem;
        }

        return { ...state, items: updatedItems };

    }

    if(action.type === 'CLEAR_CART'){
        return { ...state, items: [] };
    }


    return state;
}

export function CartContextProvider({ children }){

    // cartReducer --> responsible for updating state as per action received
    // dispatchCartAction --> function returned by useReducer that allows you to send action to reducer
    // When you call dispatchCartAction with an action object (e.g., { type: 'ADD_ITEM', item }), 
    // it triggers the reducer function to update the state accordingly.
    // {items: []} --> initial state

    const [cart, dispatchCartAction] = useReducer(cartReducer, {items: []});
    
    function addItem(item){
        dispatchCartAction({ type: 'ADD_ITEM', item })
    }
    function removeItem(id){
        dispatchCartAction({ type: 'REMOVE_ITEM', id })
    }
    function clearCart(){
        dispatchCartAction({type: 'CLEAR_CART'});
    }

    const cartContext = {
        items: cart.items,
        addItem,
        removeItem,
        clearCart
    } 

    console.log('cartContext ---', cartContext);
    return <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>;
}

export default CartContext;