import React, { useContext } from "react";
import LocalDepotTable from "./LocalDepotTable";
import { OrdersContext } from "../../components/useOrders";

const LocalDepot: React.FC = () => {
  const { orders } = useContext(OrdersContext);

  return (
    <div className="flex flex-col h-full md:p-8">
      <div className="h-full w-full">
        <LocalDepotTable orders={orders} />
      </div>
    </div>
  );
};

export default LocalDepot;
