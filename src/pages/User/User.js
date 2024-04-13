import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, LinearProgress, ThemeProvider, createTheme } from "@mui/material";
import { mkConfig, generateCsv, download } from "export-to-csv";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { FaSortDown } from "react-icons/fa";
import { toast } from "react-toastify";
import { BsFiletypeCsv } from "react-icons/bs";
import { FaRegFilePdf } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdPictureAsPdf, MdOutlinePictureAsPdf } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { Tooltip, Zoom } from "@mui/material";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const UserActivation = () => {
  const [data, setData] = useState([
    {
      userName: "Chandru",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const role = sessionStorage.getItem("role");
  // console.log(role);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");

  const columns = useMemo(
    () => [
      {
        accessorKey: "userName",
        enableHiding: false,
        header: "User Name",
        Cell: ({ row }) => (
          <Link to={`/users/show`} className="rowName">
            {row.original.userName}
          </Link>
        ),
      },
      {
        accessorKey: "companyName",
        enableHiding: false,
        header: "Company Name",
      },
      {
        accessorKey: "email",
        enableHiding: false,
        header: "Email-Address",
      },
      {
        accessorKey: "role",
        enableHiding: false,
        header: "Role",
      },
      {
        accessorKey: "phone",
        enableHiding: false,
        header: "Phone Number",
        Cell: ({ row }) => (
          <span>
            {row.original.countryCode}&nbsp;{row.original.phone}
          </span>
        ),
      },
      {
        accessorKey: "street",
        header: "Street",
      },
      {
        accessorKey: "city",
        header: "City",
      },
      {
        accessorKey: "zipCode",
        header: "Zip Code",
      },
      {
        accessorKey: "state",
        header: "State",
      },
      {
        accessorKey: "country",
        header: "Country",
      },
    ],
    []
  );

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(
  //       `https://65963d8b6bb4ec36ca02337b.mockapi.io/newuser`,
  //       {
  //         // headers: {
  //         //   //Authorization: `Bearer ${token}`,
  //         // },
  //       }
  //     );
  //     setData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  // const handleExportRowsPDF = (rows) => {
  //   const doc = new jsPDF();
  //   doc.setFontSize(20);
  //   doc.text("Leads", 15, 15);

  //   const tableHeaders1 = [
  //     "S.no",
  //     "Lead Name",
  //     "Company Name",
  //     "Email-Address",
  //     "Phone Number",
  //     "Lead Owner",
  //   ];
  //   const tableData1 = rows.map((row, i) => {
  //     return [
  //       i + 1,
  //       row.original.userName,
  //       row.original.companyName,
  //       row.original.email,
  //       row.original.phone,
  //       row.original.lead_owner,
  //     ];
  //   });

  //   autoTable(doc, {
  //     head: [tableHeaders1],
  //     body: tableData1,
  //     startY: 25,
  //     styles: {
  //       cellPadding: 1,
  //       fontSize: 10,
  //       cellWidth: "auto",
  //       cellHeight: "auto",
  //     },
  //   });

  //   const tableHeaders2 = [
  //     "Land Line",
  //     "Lead Source",
  //     "Lead Status",
  //     "Street",
  //     "City",
  //   ];
  //   const tableData2 = rows.map((row) => {
  //     return [
  //       row.original.land_line,
  //       row.original.lead_source,
  //       row.original.lead_status,
  //       row.original.street,
  //       row.original.city,
  //     ];
  //   });
  //   autoTable(doc, {
  //     head: [tableHeaders2],
  //     body: tableData2,
  //     styles: {
  //       cellPadding: 1,
  //       fontSize: 10,
  //       cellWidth: "auto",
  //       cellHeight: "auto",
  //     },
  //   });

  //   const tableHeaders3 = [
  //     "Zip Code",
  //     "State",
  //     "Country",
  //     "Created By",
  //     "Updated By",
  //   ];
  //   const tableData3 = rows.map((row) => {
  //     return [
  //       row.original.zipCode,
  //       row.original.state,
  //       row.original.country,
  //       row.original.created_by,
  //       row.original.updatedBy,
  //     ];
  //   });
  //   autoTable(doc, {
  //     head: [tableHeaders3],
  //     body: tableData3,
  //     styles: {
  //       cellPadding: 1,
  //       fontSize: 10,
  //       cellWidth: "auto",
  //       cellHeight: "auto",
  //     },
  //   });

  //   const tableHeaders4 = ["Description", "Skype ID", "Twitter"];
  //   const tableData4 = rows.map((row) => {
  //     return [
  //       row.original.Description,
  //       row.original.skype_id,
  //       row.original.twitter,
  //     ];
  //   });
  //   autoTable(doc, {
  //     head: [tableHeaders4],
  //     body: tableData4,
  //     styles: {
  //       cellPadding: 1,
  //       fontSize: 10,
  //       cellWidth: "auto",
  //       cellHeight: "auto",
  //     },
  //   });

  //   doc.save("ECS.pdf");
  // };

  const theme = createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            color: "white",
            backgroundColor: "#0066fffb !important",
          },
        },
      },
    },
  });

  const handelNavigateClick = () => {
    navigate("/users/create");
  };

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      columnVisibility: {
        city: false,
        street: false,
        country: false,
        zipCode: false,
        state: false,
      },
    },
    enableRowSelection: true,
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <button className="btn text-secondary" onClick={handleExportData}>
          <RiFileExcel2Fill size={23} />
        </button>

        <Tooltip TransitionComponent={Zoom} title="Selected Row">
          <button
            className="btn text-secondary border-0"
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          >
            <RiFileExcel2Line size={23} />
          </button>
        </Tooltip>

        <button
          className="btn text-secondary"
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //   onClick={() =>
          //     handleExportRowsPDF(table.getPrePaginationRowModel().rows)
          //   }
        >
          <MdPictureAsPdf size={23} />
        </button>
        <Tooltip TransitionComponent={Zoom} title="Selected Row">
          <button
            className="btn text-secondary border-0"
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            // onClick={() => handleExportRowsPDF(table.getSelectedRowModel().rows)}
          >
            <MdOutlinePictureAsPdf size={23} />
          </button>
        </Tooltip>
      </Box>
    ),
  });

  return (
    <section>
      {loading && <LinearProgress />}
      {!loading && (
        <>
          <div className="d-flex align-items-center justify-content-end py-4 px-3">
            <div style={{ paddingRight: "10px" }}>
              <button
                className={`btn btn-primary ${
                  role === "CMP_USER" && "disabled"
                }`}
                disabled={role === "CMP_USER" || role === "CMP_ADMIN"}
                onClick={handelNavigateClick}
              >
                Create Lead
              </button>
            </div>
          </div>
          <ThemeProvider theme={theme}>
            <MaterialReactTable table={table} />
          </ThemeProvider>
        </>
      )}
    </section>
  );
};

export default UserActivation;
