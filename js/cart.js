export const cart = [];
export function itemExist(id) {
 return cart.find((item) => 
    item.id === id
  )
}