import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import { SpecificMediaTypes } from "@/values";
import { Order } from "@/types";

type StatsProps = {
  orders: Order[];
};

const Stats = ({ orders }: StatsProps) => {
  const [cineCount, setCineCount] = useState(0);
  const [avCount, setAVCount] = useState(0);
  const [photoCount, setPhotoCount] = useState(0);
  const [specificMediaTypeCounts, setSpecificMediaTypeCounts] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    setCineCount(
      orders.reduce((total, order) => total + order.media_type_counts.cine, 0)
    );
    setAVCount(
      orders.reduce((total, order) => total + order.media_type_counts.av, 0)
    );
    setPhotoCount(
      orders.reduce((total, order) => total + order.media_type_counts.photo, 0)
    );

    const newCounts: Record<string, number> = {};
    orders.forEach((order) => {
      order.lab_lines?.forEach((labLine) => {
        newCounts[labLine.specificMediaType] =
          (newCounts[labLine.specificMediaType] || 0) + 1;
      });
    });
    setSpecificMediaTypeCounts(newCounts);
  }, [orders]);

  return (
    <>
      <div className="w-full flex flex-col p-2 bg-base-100 shadow-lg sm:rounded-b-lg">
        <div className="grid grid-rows-2 grid-cols-2 w-full sm:w-fit sm:mx-auto my-2">
          {[
            { title: "Total Queue", count: cineCount + avCount + photoCount },
            { title: "Cine Queue", count: cineCount },
            { title: "AV Queue", count: avCount },
            { title: "Photo Queue", count: photoCount },
          ].map(({ title, count }) => (
            <StatCard key={title} className="w-full sm:w-52 h-16">
              <span className="font-semibold mr-2">{title}: </span>
              <span>{count.toString()}</span>
            </StatCard>
          ))}
        </div>

        <div className="h-0 border-2 border-gray-300 my-2 mx-0" />

        <div className="flex flex-row w-full my-2 overflow-x-scroll">
          {SpecificMediaTypes.map((specificMediaType) => (
            <StatCard key={specificMediaType}>
              <span className="font-semibold mr-2">{specificMediaType}: </span>
              <span>{specificMediaTypeCounts[specificMediaType] | 0}</span>
            </StatCard>
          ))}
        </div>
      </div>
    </>
  );
};
export default Stats;
