import {
    MaterialReactTable,
    useMaterialReactTable,
  } from "material-react-table";
  import { Box, LinearProgress, ThemeProvider, createTheme } from "@mui/material";
  import { mkConfig, generateCsv, download } from "export-to-csv";
  import React, { useEffect, useMemo, useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import axios from "axios";
  import { API_URL } from "../../src/Config/URL";
  import { FaSortDown } from "react-icons/fa";
  import { toast } from "react-toastify";
  import { BsFiletypeCsv } from "react-icons/bs";
  import { FaRegFilePdf } from "react-icons/fa";
  import { jsPDF } from "jspdf";
  import autoTable from "jspdf-autotable";
  import { RiFileExcel2Fill } from "react-icons/ri";
  import { MdPictureAsPdf, MdOutlinePictureAsPdf } from "react-icons/md";
  import { RiFileExcel2Line } from "react-icons/ri";
  import { OverlayTrigger, Tooltip } from 'react-bootstrap';
  
  const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });
  
  const AllClient = () => {
    const [data, setData] = useState([]);
    // console.log("Api Product Data",data);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");
    const companyId = sessionStorage.getItem("companyId");
  
    const columns = useMemo(
      () => [
        // {
        //   accessorKey: "productName",
        //   enableHiding: false,
        //   header: "Product Name",
        //   Cell: ({ row }) => (
        //     <Link to={`/products/show/${row.original.id}`} className="rowName">
        //       {row.original.productName}
        //     </Link>
        //   ),
        // },
        {
          accessorKey: "name",
          enableHiding: false,
          header: "Name",
        },
        {
          accessorKey: "companyname",
          enableHiding: false,
          header: "Company Name",
        },
        {
          accessorKey: "stage",
          enableHiding: false,
          header: "Stage",
        },
        {
          accessorKey: "phone",
          enableHiding: false,
          header: "Phone",
        },
        {
          accessorKey: "email;",
          enableHiding: false,
          header: "Email",
        },
        {
          accessorKey: "accountid",
          enableHiding: false,
          header: "Account Id",
        },
      
      ],
      []
    );
  
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios(
          `${API_URL}allProductsByCompanyId/${companyId}`,
          {
            headers: {
              "Content-Type": "application/json",
              //Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        toast.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const handleExportRows = (rows) => {
      const rowData = rows.map((row) => row.original);
      const csv = generateCsv(csvConfig)(rowData);
      download(csvConfig)(csv);
    };
  
    const handleExportData = () => {
      const csv = generateCsv(csvConfig)(data);
      download(csvConfig)(csv);
    };
  
    const handelNavigateClick = () => {
      navigate("/products/create");
    };
    const handleExportRowsPDF = (rows) => {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Product", 15, 15);
  
    //   const tableHeaders1 = [
    //     "S.no",
    //     "Product Name",
    //     "Product Code",
    //     "Vendor Name",
    //     "Product Owner",
    //     "Product Active",
  
    //   ];
    //   const tableData1 = rows.map((row, i) => {
    //     return [
    //       i + 1,
    //       row.original.productName,
    //       row.original.productCode,
    //       row.original.vendorName,
    //       row.original.productOwner,
    //       row.original.productActive,
  
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
    //     "Product Category",
    //     "Sales Start Date",
    //     "Sales End Date",
  
    //   ];
    //   const tableData2 = rows.map((row) => {
    //     return [
    //       row.original.productCategory,
    //       row.original.salesStartDate,
    //       row.original.salesEndDate,
  
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
    //     "Support Start Date",
    //     "Support End Date",
    //     "Description",
    //   ];
    //   const tableData3 = rows.map((row) => {
    //     return [
    //       row.original.supportStartDate,
    //       row.original.supportEndDate,
    //       row.original.description_info,
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
  
      doc.save("ECS.pdf");
    };
  
    const handleSendProductsToInvoice = async (rows) => {
      const rowData = rows.map((row) => row.original.id);
      const invoiceId = sessionStorage.getItem("invoice_id");
      try {
        const response = await axios.post(
          `${API_URL}associateProductsWithInvoice/${invoiceId}`,
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
          sessionStorage.removeItem("invoice_id");
          navigate("/invoices");
          table.setRowSelection(false);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    };
  
    const handleSendProductsToQuote = async (rows) => {
      const rowData = rows.map((row) => row.original.id);
      const quoteId = sessionStorage.getItem("quote_id");
      try {
        const response = await axios.post(
          `${API_URL}associateProductsWithQuote/${quoteId}`,
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
          sessionStorage.removeItem("quote_id");
          navigate("/quotes");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
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
  
    const handleBulkDelete = async (rows) => {
      const rowData = rows.map((row) => row.original);
      try {
        const response = await axios.post(
          `${API_URL}deleteMultipleProductData`,
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
          navigate("/products");
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
          productCategory: false,
          productActive: false,
          salesStartDate: false,
          salesEndDate: false,
          supportStartDate: false,
          supportEndDate: false,
          description_info: false,
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
  
          <OverlayTrigger placement="top"
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
          </OverlayTrigger>
  
          <button className="btn text-secondary"
            disabled={table.getPrePaginationRowModel().rows.length === 0}
            onClick={() =>
              handleExportRowsPDF(table.getPrePaginationRowModel().rows)
            }
          >
            <MdPictureAsPdf size={23} />
          </button>
          <OverlayTrigger placement="top"
            overlay={<Tooltip id="selected-row-tooltip">Selected Row</Tooltip>}
          >
            <button
              className="btn text-secondary border-0"
              disabled={
                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
              }
              onClick={() => handleExportRowsPDF(table.getSelectedRowModel().rows)}
            >
              <MdOutlinePictureAsPdf size={23} />
            </button>
          </OverlayTrigger>
        </Box>
      ),
    });
  
    return (
      <section>
        {loading && <LinearProgress />}
        {!loading && (
          <>
            <div className="d-flex align-items-center justify-content-end py-4 px-3">
              {/* <div style={{ paddingRight: "10px" }}>
                <button
                  className={`btn btn-primary ${role === "CMP_USER" && "disabled"
                    }`}
                  disabled={role === "CMP_USER" || role === "CMP_ADMIN"}
                  onClick={handelNavigateClick}
                >
                  Create Product
                </button>
              </div> */}
              <div class="dropdown-center">
                {/* <button
                  class="btn btn-danger dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Action <FaSortDown style={{ marginTop: "-6px" }} />
                </button> */}
                <ul class="dropdown-menu">
                  {role === "CRM_SUPERADMIN" ? (
                    <>
                      {/* <li>
                        <button
                          className="btn"
                          style={{ width: "100%", border: "none" }}
                          disabled={
                            !table.getIsSomeRowsSelected() &&
                            !table.getIsAllRowsSelected()
                          }
                          onClick={() =>
                            handleSendProductsToInvoice(
                              table.getSelectedRowModel().rows
                            )
                          }
                        >
                          Send to Invoice
                        </button>
                      </li> */}
                      {/* <li>
                        <button
                          className="btn"
                          style={{ width: "100%", border: "none" }}
                          disabled={
                            !table.getIsSomeRowsSelected() &&
                            !table.getIsAllRowsSelected()
                          }
                          onClick={() =>
                            handleSendProductsToQuote(
                              table.getSelectedRowModel().rows
                            )
                          }
                        >
                          Send to Quote
                        </button>
                      </li> */}
                      <li>
                        <button
                          className="btn"
                          style={{ width: "100%", border: "none" }}
                          disabled={
                            !(
                              table.getIsSomeRowsSelected() ||
                              table.getIsAllRowsSelected()
                            ) || table.getSelectedRowModel().rows.length !== 1
                          }
                          onClick={() =>
                            handleBulkDelete(table.getSelectedRowModel().rows)
                          }
                        >
                          Delete
                        </button>
                      </li>
                      <li>
                        <button
                          className="btn"
                          style={{ width: "100%", border: "none" }}
                          disabled={
                            !table.getIsSomeRowsSelected() &&
                            !table.getIsAllRowsSelected()
                          }
                          onClick={() =>
                            handleBulkDelete(table.getSelectedRowModel().rows)
                          }
                        >
                          Mass Delete
                        </button>
                      </li>
                    </>
                  ) : role === "CRM_ADMIN" || role === "CMP_OWNER" ? (
                    <>
                      <li>
                        <button
                          className="btn"
                          style={{ width: "100%", border: "none" }}
                          disabled={
                            !table.getIsSomeRowsSelected() &&
                            !table.getIsAllRowsSelected()
                          }
                          onClick={() =>
                            handleSendProductsToInvoice(
                              table.getSelectedRowModel().rows
                            )
                          }
                        >
                          Send to Invoice
                        </button>
                      </li>
                      <li>
                        <button
                          className="btn"
                          style={{ width: "100%", border: "none" }}
                          disabled={
                            !table.getIsSomeRowsSelected() &&
                            !table.getIsAllRowsSelected()
                          }
                          onClick={() =>
                            handleSendProductsToQuote(
                              table.getSelectedRowModel().rows
                            )
                          }
                        >
                          Send to Quote
                        </button>
                      </li>
                    </>
                  ) : (
                    // Render disabled buttons for CMP_USER
                    <>
                      <li>
                        <button
                          className="btn"
                          style={{ width: "100%", border: "none" }}
                          disabled
                        >
                          Send to Invoice
                        </button>
                      </li>
                      <li>
                        <button
                          className="btn"
                          style={{ width: "100%", border: "none" }}
                          disabled
                        >
                          Send to Quote
                        </button>
                      </li>
                      <li>
                        <button
                          className="btn"
                          style={{ width: "100%", border: "none" }}
                          disabled
                        >
                          Delete
                        </button>
                      </li>
                      <li>
                        <button
                          className="btn"
                          style={{ width: "100%", border: "none" }}
                          disabled
                        >
                          Mass Delete
                        </button>
                      </li>
                    </>
                  )}
                </ul>
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
  
  export default AllClient;
  