
// Importar parseJsonObject e parseJsonArray
import { parseJsonObject, parseJsonArray } from "@/utils/supabaseJsonUtils";

// Na parte onde os pedidos são mapeados, devemos usar as funções parseJson
const mappedOrders = orders.map(order => {
  const orderItems = parseJsonArray(order.items, []);
  const shippingAddress = parseJsonObject(order.shipping_address, {});
  
  return {
    id: order.id,
    user_id: order.user_id,
    status: order.status,
    total: order.total_amount,
    subtotal: order.subtotal || 0,
    shipping_cost: order.shipping_fee,
    payment_method: order.payment_method || 'Não informado',
    payment_status: order.status === 'completed' ? 'Pago' : 'Pendente',
    items: orderItems,
    shipping_address: {
      zip_code: shippingAddress.zip_code,
      city: shippingAddress.city,
      state: shippingAddress.state,
      address: shippingAddress.address
    },
    created_at: order.created_at,
    discount: order.discount,
    shipping_fee: order.shipping_fee,
    total_amount: order.total_amount,
    updated_at: order.updated_at
  };
});
