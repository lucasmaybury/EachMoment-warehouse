import React, { useEffect, useState } from "react";
import { Order, Orders } from "types";
import MediaTypeIcons from "../home/MediaTypeIcons";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import { DefaultOrderStatus } from "../../values";
import CDLIndicator from "../../components/CDLIndicator";
import SearchBar from "../../components/SearchBar";
import StatsTab from "@/components/stats/StatsTab";
import LoadingSpinnerFull from "@/components/LoadingSpinnerFull";

type OrderTablePropsType = {
  orders: Orders;
};

const OrderTable = ({ orders: ordersAll }: OrderTablePropsType) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [cdlFilterToggle, setCdlFilterToggle] = React.useState(false);
  const [ukFilter, setUkFilter] = useState(true);
  const [euFilter, setEuFilter] = useState(true);

  const navigate = useNavigate();
  const goOrderDetails = (id: string) => {
    navigate(`/order/${id}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    const searchQueryText = (e.target as HTMLInputElement).value;
    setSearchQuery(searchQueryText);
  };

  useEffect(() => {
    let ordersFiltered = Object.values(ordersAll);

    if (searchQuery) {
      const searchQueryLower = searchQuery.toLowerCase();
      ordersFiltered = ordersFiltered.filter(
        (order: Order) =>
          order.id.toLowerCase().includes(searchQueryLower) ||
          order.customer_info.email.toLowerCase().includes(searchQueryLower)
      );
    }

    if (cdlFilterToggle) {
      ordersFiltered = ordersFiltered.filter((order: Order) => order.CDL?.date);
    }

    ordersFiltered = ordersFiltered.filter(
      (order: Order) =>
        (ukFilter && order.lab === "UK") || (euFilter && order.lab === "EU")
    );

    // Extract the numeric part of the ID and sort based on it
    ordersFiltered
      .sort((a, b) => {
        // Assuming the ID has a prefix followed by numbers, like "ORDER123"
        const numberPattern = /\d+/;
        const aNumberPart = parseInt(a.id.match(numberPattern)?.[0] || "0", 10);
        const bNumberPart = parseInt(b.id.match(numberPattern)?.[0] || "0", 10);
        return aNumberPart - bNumberPart;
      })
      .reverse();

    setOrders(ordersFiltered);
  }, [searchQuery, cdlFilterToggle, ukFilter, euFilter, ordersAll]);

  const toggleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFilter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setFilter(e.target.checked);
  };

  return (
    <>
      <StatsTab orders={orders} />
      <div className="h-full w-full">
        <table className="table table-zebra table-pin-rows h-full w-full grow md:shadow-md">
          <thead className="hidden md:table-header-group">
            <tr className="bg-gray-200">
              <th>Order Id</th>
              <th>Status</th>
              <th>CDL Urgency</th>
              <th>Media Types</th>
            </tr>
          </thead>

          <tbody className="h-full">
            <tr key={"search-bar"} className="h-20 p-1 bg-gray-200">
              <td colSpan={5}>
                <SearchBar handleSearch={handleSearch} />
              </td>
            </tr>
            {orders.length === 0 && <LoadingSpinnerFull />}
            {orders.map((order: Order) => (
              <tr
                key={order.id}
                onClick={() => goOrderDetails(order.id)}
                className="h-16 hover:outline hover:outline-2 hover:outline-info cursor-pointer"
              >
                <td className="p-2 pl-3">{order.id}</td>
                <td>
                  <StatusBadge status={order.status || DefaultOrderStatus} />
                </td>
                <td>
                  <CDLIndicator cdl={order.CDL ?? null} />
                </td>
                <td>
                  <MediaTypeIcons
                    mediaTypes={{
                      av: (order.media_type_counts?.av ?? 0) > 0,
                      cine: (order.media_type_counts?.cine ?? 0) > 0,
                      photo: (order.media_type_counts?.photo ?? 0) > 0,
                    }}
                  />
                </td>
              </tr>
            ))}
            <tr key="spacer" className="w-full mt-auto h-auto"></tr>
          </tbody>

          <tfoot style={{ insetBlockEnd: 0, position: "sticky" }}>
            <tr>
              <th colSpan={4} className="p-0">
                <div className="flex flex-row align-middle justify-between w-full h-12 bg-gray-200 z-[3]">
                  <div className="flex flex-row p-1 m-1">
                    <label className="cursor-pointer flex flex-row m-1">
                      <span className="m-1 my-auto">CDL</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-info toggle-sm m-1 my-auto"
                        checked={cdlFilterToggle}
                        onChange={(e) => toggleChange(e, setCdlFilterToggle)}
                      />
                    </label>
                    <label className="cursor-pointer flex flex-row m-1">
                      <span className="m-1 my-auto">UK</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-info toggle-sm m-1 my-auto"
                        checked={ukFilter}
                        onChange={(e) => toggleChange(e, setUkFilter)}
                      />
                    </label>
                    <label className="cursor-pointer flex flex-row m-1">
                      <span className="m-1 my-auto">EU</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-info toggle-sm m-1 my-auto"
                        checked={euFilter}
                        onChange={(e) => toggleChange(e, setEuFilter)}
                      />
                    </label>
                  </div>
                </div>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};

export default OrderTable;
