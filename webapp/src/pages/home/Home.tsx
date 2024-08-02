import React, { useContext } from "react";
import OrderTable from "../orders/OrderTable";
import CameraNavButton from "../QRScanner/CameraNavButton";
import { OrdersContext } from "../../components/useOrders";

const Home: React.FC = () => {
  const { orders } = useContext(OrdersContext);

  return (
    <>
      <div className="flex flex-col h-full md:p-8">
        <div className="h-full w-full">
          <OrderTable orders={orders} />
        </div>
        <CameraNavButton />
      </div>
    </>
  );
};

export default Home;
