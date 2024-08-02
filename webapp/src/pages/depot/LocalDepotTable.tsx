import React, { useState } from "react";
import SearchBar from "../../components/SearchBar";
import StatusBadge from "../../components/StatusBadge";
import { updateOrderStatus } from "../../utils/orderHelpers";
import { OrderStatus } from "types";
import { Orders } from "types";

type LocalDepotTableProps = {
  orders: Orders;
};

const LocalDepotTable = ({ orders }: LocalDepotTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredOrders = Object.values(orders).filter((order) => {
    const id = typeof order.id === "string" ? order.id.toLowerCase() : "";
    const status =
      typeof order.status === "string" ? order.status.toLowerCase() : "";
    return id.includes(searchQuery) || status.includes(searchQuery);
  });

  const handleButtonClick = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const buttonClasses =
    "btn max-md:h-fit max-md:min-h-fit w-full md:w-fit max-md:p-2 text-sm rounded";

  return (
    <div className="h-full w-full overflow-x-auto">
      <table className="table table-zebra table-pin-rows h-full w-full grow md:shadow-md">
        <thead className="hidden md:table-header-group">
          <tr className="bg-gray-200">
            <th>Order Id</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="h-full">
          <tr className="p-1 bg-gray-200">
            <td colSpan={5}>
              <SearchBar handleSearch={handleSearch} />
            </td>
          </tr>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <>
                <td>
                  <div className="flex flex-col items-center justify-center h-full md:hidden">
                    <span className="text-lg font-bold mb-4">{order.id}</span>
                    <span>
                      <StatusBadge status={order.status} />
                    </span>
                  </div>
                  <span className="hidden md:table-cell">{order.id}</span>
                </td>
                <td className="hidden md:table-cell">
                  <StatusBadge status={order.status} />
                </td>
              </>
              <td className="flex flex-col sm:flex-row gap-2 items-center justify-start">
                <button
                  className={`${buttonClasses} ${
                    order.status === "[MB] Depot Received"
                      ? "btn-info"
                      : "bg-blue-100 border-2 border-blue-200 text-black"
                  }`}
                  onClick={() =>
                    handleButtonClick(order.id, "[MB] Depot Received")
                  }
                >
                  Received
                </button>
                <button
                  className={`${buttonClasses} ${
                    order.status === "[MB] Depot Dispatched"
                      ? "btn-info"
                      : "bg-blue-100 border-2 border-blue-200 text-black"
                  }`}
                  onClick={() =>
                    handleButtonClick(order.id, "[MB] Depot Dispatched")
                  }
                >
                  Dispatched
                </button>
                <button
                  className={`${buttonClasses} bg-error text-base-100`}
                  onClick={() => handleButtonClick(order.id, "[MB] Dispatched")}
                >
                  Reset
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LocalDepotTable;
