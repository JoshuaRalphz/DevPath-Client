import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "next-themes";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { useGetAllOrdersQuery } from "@/redux/features/orders/ordersApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { AiOutlineMail } from "react-icons/ai";

type Props = {
  isDashboard?: boolean;
};

const AllInvoices = ({ isDashboard }: Props) => {
  const { theme } = useTheme();
  const { isLoading, data } = useGetAllOrdersQuery({});
  const { data: usersData } = useGetAllUsersQuery({});
  const { data: coursesData } = useGetAllCoursesQuery({});
  const isMobile = useMediaQuery("(max-width:600px)");

  const [orderData, setOrderData] = useState<any>([]);

  useEffect(() => {
    if (data) {
      const temp = data.orders.map((item: any) => {
        const user = usersData?.users.find((user: any) => user._id === item.userId);
        const course = coursesData?.courses.find((course: any) => course._id === item.courseId);
        return {
          ...item,
          userName: user?.name,
          userEmail: user?.email,
          title: course?.name,
          price: "$" + course?.price,
        };
      });
      setOrderData(temp);
    }
  }, [data, usersData, coursesData]);

  const columns: any = [
    { field: "id", headerName: "ID", flex: isMobile ? 0.5 : 0.3, minWidth: 80 },
    { field: "userName", headerName: "Name", flex: isDashboard ? 0.6 : 0.5, minWidth: 150 },
    ...(isDashboard
      ? []
      : [
          { field: "userEmail", headerName: "Email", flex: isMobile ? 0.5 : 1, minWidth: 150 },
          { field: "title", headerName: "Course Title", flex: isMobile ? 0.5 : 1, minWidth: 150 },
        ]),
    { field: "price", headerName: "Price", flex: isMobile ? 0.4 : 0.5, minWidth: 120 },
    ...(isDashboard
      ? [{ field: "created_at", headerName: "Created At", flex: 0.5, minWidth: 150 }]
      : [
          {
            field: " ",
            headerName: "Email",
            flex: 0.2,
            minWidth: 80,
            renderCell: (params: any) => (
              <a href={`mailto:${params.row.userEmail}`}>
                <AiOutlineMail className="dark:text-white text-black" size={20} />
              </a>
            ),
          },
        ]),
  ];

  const rows: any = orderData.map((item: any) => ({
    id: item._id,
    userName: item.userName,
    userEmail: item.userEmail,
    title: item.title,
    price: item.price,
    created_at: format(item.createdAt),
  }));

  return (
    <div className="px-4 sm:px-8" style={{ maxWidth: '1200px', margin: '0 auto' }}> {/* Set max width and center container */}
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px" mt="150px"> {/* Add margin-top here */}
          <Box
            height="80vh"
            sx={{
              overflowX: 'auto', // Allow horizontal scrolling
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
              },
              "& .MuiDataGrid-row": {
                color: theme === "dark" ? "#fff" : "#000",
                borderBottom: theme === "dark"
                  ? "1px solid var(--border-color-dark) !important"
                  : "1px solid var(--border-color-light) !important",
              },
              "& .MuiTablePagination-root": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
              },
              "& .MuiDataGrid-footerContainer": {
                color: theme === "dark" ? "#fff" : "#000",
                backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0", // Match the virtualScroller background
                borderTop: "none", // Remove border if any
              },
            }}
          >
            <DataGrid
              checkboxSelection={!isDashboard}
              rows={rows}
              columns={columns}
              components={!isDashboard ? { Toolbar: GridToolbar } : {}}
            />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default AllInvoices;
