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
// import QuotesModel from "./QuotesModel";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdPictureAsPdf, MdOutlinePictureAsPdf } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import QuotesMultipleModel from "./QuotesMultipleModel";
import TableDeleteModel from "../../components/common/TableDeleteModel";
import * as XLSX from "xlsx";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Accounts = () => {
  const [data, setData] = useState([]);
  // const [rowId, setRowId] = useState("");
  const [rowMultipleId, setRowMultipleId] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = sessionStorage.getItem("role");
  const companyId = sessionStorage.getItem("companyId");
  const accountId = sessionStorage.getItem("accountId");
  const owner = sessionStorage.getItem("user_name");

  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        accessorKey: "firstName",
        enableHiding: false,
        header: "Account Name",
        Cell: ({ row }) => (
          <Link to={`/accounts/show/${row.original.id}`} className="rowName">
            {row.original.firstName} {row.original.lastName}
          </Link>
        ),
      },
      {
        accessorKey: "accountNumber",
        enableHiding: false,
        header: "Account Number",
      },
      {
        accessorKey: "email",
        enableHiding: false,
        header: "Email",
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
        accessorKey: "shippingStreet",
        header: "Shipping Street",
      },

      {
        accessorKey: "shippingCity",
        header: "Shipping City",
      },

      {
        accessorKey: "shippingState",
        header: "Shipping State",
      },

      {
        accessorKey: "shippingCode",
        header: "Shipping Code",
      },
      {
        accessorKey: "shippingCountry",
        header: "Shipping Country",
      },
      {
        accessorKey: "billingStreet",
        header: "Billing Street",
      },

      {
        accessorKey: "billingCity",
        header: "Billing City",
      },

      {
        accessorKey: "billingState",
        header: "Billing State",
      },

      {
        accessorKey: "billingCode",
        header: "Billing Code",
      },
      {
        accessorKey: "parentAccount",
        // enableHiding: true,
        header: "Parent Account",
      },
      {
        accessorKey: "billingCountry",
        header: "Billing Country",
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        Cell: ({ row }) => row.original.createdAt.substring(0, 10),
      },
      {
        accessorKey: "updated_at",
        header: "Updated At",
        Cell: ({ row }) => {
          if (row.original.updatedAt) {
            return row.original.updatedAt.substring(0, 10);
          } else {
            return "";
          }
        },
      },

      // {
      //   accessorKey: "id",
      //   enableHiding: false,
      //   header: "Create Quote",
      //   Cell: ({ row }) => (
      //     <Link to="/quotes" className="d-flex">
      //       <div
      //         className="d-flex align-items-center justify-content-center"
      //         style={{
      //           padding: "5px",
      //           backgroundColor: "rgba(165, 255, 140, 0.5)",
      //           borderRadius: "50%",
      //           width: "40px",
      //           height: "40px",
      //         }}
      //       >
      //         <input
      //           type="radio"
      //           onChange={() =>
      //             sessionStorage.setItem("account_id", row.original.id)
      //           }
      //           name="account"
      //           id="account"
      //           className="form-check-input"
      //         />
      //       </div>
      //       <span style={{ fontSize: "20px" }} className="px-1">
      //         <ImQuotesRight />
      //       </span>
      //     </Link>
      //   ),
      // },
    ],
    []
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios(
        `${API_URL}allAccountsByCompanyId/${companyId}`,
        {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterFields = (data) =>
    data.map((row, index) => ({
      "S.no": index + 1,
      "Account Name": row.accountName,
      "Name": row.firstName,
      "Email-Address": row.email,
      "Phone Number": row.phone,
      "Account Owner": row.accountOwner,
    }));
  
  const handleExportRows = (selectedRows = []) => {
    const dataToExport = selectedRows.length
      ? filterFields(selectedRows.map((row) => row.original))
      : filterFields(data);
  
    const totalRow = {
      "S.no": "",
      "Account Name": "",
      "Name": "",
      "Email-Address": "Total Records",
      "Phone Number": dataToExport.length,
      "Account Owner": "",
    };
    dataToExport.push(totalRow);
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const uniformWidth = 20;
    ws["!cols"] = Array(Object.keys(dataToExport[0]).length).fill({ wch: uniformWidth });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Accounts");
  
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename =
      selectedRows.length === 1
        ? `${selectedRows[0].original.accountName}_${timestamp}.xlsx`
        : `Account_list_${timestamp}.xlsx`;
  
    XLSX.writeFile(wb, filename);
  };
  

  const handleExportRowsPDF = (rows) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Accounts", 15, 15);

    const tableHeaders1 = [
      "S.no",
      "Account Name",
      "Company",
      "Email-Address",
      "Phone Number",
      "Account Owner",
    ];

    const tableData1 = rows.map((row, i) => {
      return [
        i + 1,
        row.original.accountName,
        row.original.firstName,
        row.original.email,
        row.original.phone,
        row.original.accountOwner,
      ];
    });
    if (rows.length > 1) {
      tableData1.push(["", "", "Total Records", rows.length, "", ""]);
    }

    autoTable(doc, {
      head: [tableHeaders1],
      body: tableData1,
      startY: 25,
      styles: {
        cellPadding: 1,
        fontSize: 10,
        cellWidth: "auto",
        cellHeight: "auto",
      },
    });

    // const tableHeaders2 = [
    //   "Land Line",
    //   "Lead Source",
    //   "Lead Status",
    //   "Street",
    //   "City",
    // ];
    // const tableData2 = rows.map((row) => {
    //   return [
    //     row.original.land_line,
    //     row.original.lead_source,
    //     row.original.lead_status,
    //     row.original.street,
    //     row.original.city,
    //   ];
    // });
    // autoTable(doc, {
    //   head: [tableHeaders2],
    //   body: tableData2,
    //   styles: {
    //     cellPadding: 1,
    //     fontSize: 10,
    //     cellWidth: "auto",
    //     cellHeight: "auto",
    //   },
    // });

    // const tableHeaders3 = [
    //   "Zip Code",
    //   "State",
    //   "Country",
    //   "Created By",
    //   "Updated By",
    // ];

    // const tableData3 = rows.map((row) => {
    //   return [
    //     row.original.zipCode,
    //     row.original.state,
    //     row.original.country,
    //     row.original.created_by,
    //     row.original.updatedBy,
    //   ];
    // });
    // autoTable(doc, {
    //   head: [tableHeaders3],
    //   body: tableData3,
    //   styles: {
    //     cellPadding: 1,
    //     fontSize: 10,
    //     cellWidth: "auto",
    //     cellHeight: "auto",
    //   },
    // });

    // const tableHeaders4 = [
    //   "Description",
    //   "Skype ID",
    //   "Twitter",
    //   "Created At",
    //   "Updated At",
    // ];
    // const tableData4 = rows.map((row) => {
    //   return [
    //     row.original.Description,
    //     row.original.skype_id,
    //     row.original.twitter,
    //     row.original.createdAt,
    //     row.original.updatedAt,
    //   ];
    // });
    // autoTable(doc, {
    //   head: [tableHeaders4],
    //   body: tableData4,
    //   styles: {
    //     cellPadding: 1,
    //     fontSize: 10,
    //     cellWidth: "auto",
    //     cellHeight: "auto",
    //   },
    // });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-"); // Format timestamp
    const filename =
      rows.length === 1
        ? `${rows[0].original.firstName}_${timestamp?.slice(0, 10)}.pdf`
        : `Accounts_List_${timestamp?.slice(0, 10)}.pdf`;

    doc.save(filename);
  };

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

  const handleAssignQuote = async (rows) => {
    const rowData = rows.map((row) => row.original.id);
    // sessionStorage.setItem("account_id", rowData);
    setRowMultipleId(rowData);
    table.setRowSelection(false);
  };

  const handelNavigateClick = () => {
    navigate("/accounts/create");
  };

  const handleBulkConvert = async (rows) => {
    rows.forEach((row) => {
      row.original.company_id = companyId;
    });
    const rowData = rows.map((row) => row.original);
    try {
      const response = await axios.post(
        `${API_URL}transferAccountBulkData`,
        rowData,
        {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/accounts");
        table.setRowSelection(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }

    fetchData();
  };

  const handleDealConvert = async (rows) => {
    const id = rows.map((row) => row.original.id);

    try {
      const response = await axios.post(
        `${API_URL}accountToDealConvert/${id}?ownerName=${owner}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/accounts");
        table.setRowSelection(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error Submiting Data");
    }
  };

  const handleContactConvert = async (rows) => {
    rows.forEach((row) => {
      row.original.account_id = accountId;
    });

    const rowData = rows.map((row) => row.original);
    const id = rows.map((row) => row.original.id).toString();
    try {
      const response = await axios.post(
        `${API_URL}accountToContactConvert/${id}?ownerName=${owner}`,
        rowData,
        {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/accounts");
        table.setRowSelection(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
    fetchData();
  };

  const handleBulkDelete = async (rows) => {
    const rowData = rows.map((row) => row.original.id);
    const formattedRowData = rowData.join(",");

    const formData = new FormData();
    formData.append("accountIds", formattedRowData);
    formData.append("ownerName", owner);

    try {
      const response = await axios.post(
        `${API_URL}accountToContactConvertMultiple`,
        formData
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/accounts");
        table.setRowSelection(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
    fetchData();
  };

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      columnVisibility: {
        shippingStreet: false,
        shippingCity: false,
        shippingState: false,
        shippingCode: false,
        shippingCountry: false,
        billingStreet: false,
        billingCity: false,
        billingState: false,
        billingCode: false,
        billingCountry: false,
        parentAccount: false,
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
          {table.getPrePaginationRowModel().rows.length !== 0 && (
      <>
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="selected-row-tooltip">Download CSV</Tooltip>}
        >
          <button
            className="btn text-secondary"
            //  onClick={handleExportData}
            onClick={() => {
              const selectedRows = table.getSelectedRowModel().rows;
              handleExportRows(selectedRows);
            }}
          >
            <RiFileExcel2Fill size={23} />
          </button>
        </OverlayTrigger>
        {/* 
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="selected-row-tooltip">Selected Row</Tooltip>}
        >
          <button
            className="btn text-secondary border-0"
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          >
            <RiFileExcel2Line size={23} />
          </button>
        </OverlayTrigger> */}
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="selected-row-tooltip">Download PDF</Tooltip>}
        >
          <button
            className="btn text-secondary"
            disabled={table.getPrePaginationRowModel().rows.length === 0}
            // onClick={() =>
            //   handleExportRowsPDF(table.getPrePaginationRowModel().rows)
            // }
            onClick={() => {
              const selectedRows = table.getSelectedRowModel().rows;
              if (selectedRows.length === 1) {
                handleExportRowsPDF(selectedRows);
              } else {
                handleExportRowsPDF(table.getPrePaginationRowModel().rows);
              }
            }}
          >
            <MdPictureAsPdf size={23} />
          </button>
        </OverlayTrigger>
        {/* <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="selected-row-tooltip">Selected Row</Tooltip>}
        >
          <button
            className="btn text-secondary border-0"
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            onClick={() =>
              handleExportRowsPDF(table.getSelectedRowModel().rows)
            }
          >
            <MdOutlinePictureAsPdf size={23} />
          </button>
        </OverlayTrigger> */}
        </>
  )}
      </Box>
    ),
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        navigate(`/accounts/show/${row.original.id}`);
      },
      style: { cursor: "pointer" },
    }),
  });
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section>
      {loading && <LinearProgress />}
      {!loading && (
        <>
          <div className="d-flex align-items-center justify-content-between">
            <div className="text-start">
              <span className="fs-4 fw-bold px-2">
                Accounts ({data.length})
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-end py-4 px-3">
              <div style={{ paddingRight: "10px" }}>
                <button
                  className={`btn btn-primary ${
                    role === "CMP_USER" && "disabled"
                  }`}
                  disabled={role === "CMP_USER"}
                  onClick={handelNavigateClick}
                >
                  Create Accounts
                </button>
              </div>
              <div class="dropdown-center">
                <button
                  class="btn btn-danger dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  disabled={role === "CMP_USER"}
                >
                  Action <FaSortDown style={{ marginTop: "-6px" }} />
                </button>
                <ul class="dropdown-menu">
                  <li>
                    <button
                      className="btn"
                      style={{ width: "100%", border: "none" }}
                      disabled={
                        !table.getIsSomeRowsSelected() &&
                        !table.getIsAllRowsSelected()
                      }
                      onClick={() =>
                        handleAssignQuote(table.getSelectedRowModel().rows)
                      }
                    >
                      <QuotesMultipleModel
                        accountIds={rowMultipleId}
                        userData={fetchData}
                        path={`associateQuotesWithMultipleAccount`}
                      />
                    </button>
                  </li>
                  <li>
                    <button
                      className="btn"
                      style={{ width: "100%", border: "none" }}
                      disabled={
                        !(
                          table.getIsSomeRowsSelected() ||
                          table.getIsAllRowsSelected()
                        )
                        // || table.getSelectedRowModel().rows.length !== 1
                      }
                      onClick={() => {
                        const selectedRows = table.getSelectedRowModel().rows;
                        if (selectedRows.length === 1) {
                          handleDealConvert(selectedRows);
                        } else if (selectedRows.length > 1) {
                          handleBulkConvert(selectedRows);
                        }
                      }}
                    >
                      Convert Deal
                    </button>
                  </li>
                  {/* <li>
                    <button
                      className="btn"
                      style={{ width: "100%", border: "none" }}
                      disabled={
                        !(
                          table.getIsSomeRowsSelected() ||
                          table.getIsAllRowsSelected()
                        ) || table.getSelectedRowModel().rows.length === 1
                      }
                      onClick={() =>
                        handleBulkConvert(table.getSelectedRowModel().rows)
                      }
                    >
                      Mass Convert
                    </button>
                  </li> */}
                  <li>
                    <TableDeleteModel
                      rows={table.getSelectedRowModel().rows}
                      rowSelected={
                        !(
                          table.getIsSomeRowsSelected() ||
                          table.getIsAllRowsSelected()
                        )
                      }
                      handleBulkDelete={handleBulkDelete}
                      onSuccess={() => {
                        table.setRowSelection(false);
                        fetchData();
                      }}
                    />
                  </li>
                  {/* <li>
                    <button
                      className="btn"
                      style={{ width: "100%", border: "none" }}
                      disabled={
                        !(
                          table.getIsSomeRowsSelected() ||
                          table.getIsAllRowsSelected()
                        ) || table.getSelectedRowModel().rows.length === 1
                      }
                      onClick={() =>
                        handleBulkDelete(table.getSelectedRowModel().rows)
                      }
                    >
                      Mass Delete
                    </button>
                  </li> */}
                </ul>
              </div>
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

export default Accounts;
