import React, { FC, useEffect, useState } from "react";
import UserAnalytics from "../Analytics/UserAnalytics";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";
import { Box, CircularProgress } from "@mui/material";
import OrdersAnalytics from "../Analytics/OrdersAnalytics";
import AllInvoices from "../Order/AllInvoices";
import CourseAnalytics from "../Analytics/CourseAnalytics";
import {
  useGetOrdersAnalyticsQuery,
  useGetUsersAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";

type Props = {
  open?: boolean;
  value?: number;
};

const CircularProgressWithLabel: FC<Props> = ({ open, value }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={45}
        color={value && value > 99 ? "info" : "error"}
        thickness={4}
        style={{ zIndex: open ? -1 : 1 }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Box>
    </Box>
  );
};

const DashboardWidgets: FC<Props> = ({ open }) => {
  const [ordersComparePercentage, setOrdersComparePercentage] = useState<any>();
  const [userComparePercentage, setUserComparePercentage] = useState<any>();

  const { data, isLoading } = useGetUsersAnalyticsQuery({});
  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersAnalyticsQuery({});

  useEffect(() => {
    if (isLoading || ordersLoading) {
      return;
    }
    if (data && ordersData) {
      const usersLastTwoMonths = data.users.last12Months.slice(-2);
      const ordersLastTwoMonths = ordersData.orders.last12Months.slice(-2);

      if (usersLastTwoMonths.length === 2 && ordersLastTwoMonths.length === 2) {
        const usersCurrentMonth = usersLastTwoMonths[1].count;
        const usersPreviousMonth = usersLastTwoMonths[0].count;
        const ordersCurrentMonth = ordersLastTwoMonths[1].count;
        const ordersPreviousMonth = ordersLastTwoMonths[0].count;

        const usersPercentChange = usersPreviousMonth !== 0 ? 
          ((usersCurrentMonth - usersPreviousMonth) / usersPreviousMonth) * 100 : 100;

        const ordersPercentChange = ordersPreviousMonth !== 0 ? 
          ((ordersCurrentMonth - ordersPreviousMonth) / ordersPreviousMonth) * 100 : 100;

        setUserComparePercentage({
          currentMonth: usersCurrentMonth,
          previousMonth: usersPreviousMonth,
          percentChange: usersPercentChange,
        });

        setOrdersComparePercentage({
          currentMonth: ordersCurrentMonth,
          previousMonth: ordersPreviousMonth,
          percentChange: ordersPercentChange,
        });
      }
    }
  }, [isLoading, ordersLoading, data, ordersData]);

  return (
    <div className="mt-[30px] min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 lg:p-6 bg-white dark:bg-[#111C43] rounded-lg shadow col-span-1">
          <UserAnalytics isDashboard={true} />
        </div>

        <div className="space-y-4 lg:space-y-8 col-span-1 lg:col-span-2">
          <div className="w-full bg-white dark:bg-[#111C43] rounded-lg shadow p-4 lg:p-6 flex items-center justify-between">
            <div>
              <BiBorderLeft className="text-[#000] dark:text-[#45CBA0] text-[24px] lg:text-[30px]" />
              <h5 className="pt-2 font-Poppins text-black dark:text-[#fff] text-[16px] lg:text-[20px]">
                {ordersComparePercentage?.currentMonth}
              </h5>
              <h5 className="py-2 font-Poppins text-black dark:text-[#45CBA0] text-[14px] lg:text-[20px] font-[400]">
                Sales Obtained
              </h5>
            </div>
            <div className="flex flex-col items-center">
              <CircularProgressWithLabel value={
                ordersComparePercentage?.percentChange > 0 ? 100 : 0
              } open={open} />
              <h5 className="text-center pt-4 text-[14px] lg:text-[16px]">
                {ordersComparePercentage?.percentChange > 0
                  ? "+" + ordersComparePercentage?.percentChange.toFixed(2)
                  : "-" + ordersComparePercentage?.percentChange.toFixed(2)} %
              </h5>
            </div>
          </div>

          <div className="w-full bg-white dark:bg-[#111C43] rounded-lg shadow p-4 lg:p-6 flex items-center justify-between">
            <div>
              <PiUsersFourLight className="text-[#000] dark:text-[#45CBA0] text-[24px] lg:text-[30px]" />
              <h5 className="pt-2 font-Poppins text-black dark:text-[#fff] text-[16px] lg:text-[20px]">
                {userComparePercentage?.currentMonth}
              </h5>
              <h5 className="py-2 font-Poppins text-black dark:text-[#45CBA0] text-[14px] lg:text-[20px] font-[400]">
                New Users
              </h5>
            </div>
            <div className="flex flex-col items-center">
              <CircularProgressWithLabel value={
                userComparePercentage?.percentChange > 0 ? 100 : 0
              } open={open} />
              <h5 className="text-center pt-4 text-[14px] lg:text-[16px]">
                {userComparePercentage?.percentChange > 0
                  ? "+" + userComparePercentage?.percentChange.toFixed(2)
                  : "-" + userComparePercentage?.percentChange.toFixed(2)} %
              </h5>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#111c43] rounded-lg shadow-sm p-4 lg:p-6 h-[40vh] col-span-1 lg:col-span-2">
          <OrdersAnalytics isDashboard={true} />
        </div>
        
        <div className="bg-white dark:bg-[#111c43] rounded-lg shadow-sm p-4 lg:p-6 col-span-1 lg:col-span-1">
          <CourseAnalytics isDashboard={true} />
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
