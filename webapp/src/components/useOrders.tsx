import React, { useEffect, useState } from "react";
import { Order, Orders } from "types";
import {
  ref,
  get,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
} from "firebase/database";
import { database } from "../firebase";
import { readInOrder } from "../utils/orderHelpers";

const defaultValue = { orders: {} };
type OrdersContextType = { orders: Orders };
export const OrdersContext =
  React.createContext<OrdersContextType>(defaultValue);

type OrdersProviderProps = {
  children: React.ReactNode;
};

const OrdersProvider = ({ children }: OrdersProviderProps) => {
  const [orders, setOrders] = useState<Orders>({});

  useEffect(() => {
    const ordersRef = ref(database, "shopify-orders");
    get(ordersRef).then((snapshot) => {
      if (snapshot.exists()) {
        setOrders(
          Object.entries(snapshot.val() as Orders).reduce(
            (orders, [id, order]) => ({
              ...orders,
              [id]: readInOrder(id, order),
            }),
            {}
          )
        );
      }
    });

    onChildAdded(ordersRef, (order) => {
      if (order.exists() && order.key && order.val()) {
        setOrders((ordersCurrent) => ({
          ...ordersCurrent,
          [order.key!]: order.val() as Order,
        }));
      }
    });

    onChildChanged(ordersRef, (order) => {
      if (order.exists() && order.key && order.val) {
        setOrders((ordersCurrent) => ({
          ...ordersCurrent,
          [order.key!]: order.val() as Order,
        }));
      }
    });

    onChildRemoved(ordersRef, (order) => {
      if (order.exists() && order.key) {
        setOrders((ordersCurrent) => {
          const ordersCopy = { ...ordersCurrent };
          delete ordersCopy[order.key!];
          return ordersCopy;
        });
      }
    });
  }, []);

  return (
    <OrdersContext.Provider value={{ orders }}>
      {children}
    </OrdersContext.Provider>
  );
};

export default OrdersProvider;
