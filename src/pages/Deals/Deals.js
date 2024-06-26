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
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import InvoiceModel from "./InvoiceModel";
import InvoiceMultipleModel from "./InvoiceMultipleModel";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Deals = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const owner = sessionStorage.getItem("user_name");
  const role = sessionStorage.getItem("role");
  const companyId = sessionStorage.getItem("companyId");
  const navigate = useNavigate();
  const [rowMultipleId, setRowMultipleId] = useState([]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "dealName",
        enableHiding: false,
        header: "Deal Name",
        Cell: ({ row }) => (
          <Link to={`/deals/show/${row.original.id}`} className="rowName">
            {row.original.dealName}
          </Link>
        ),
      },
      // {
      //   accessorKey: "accountName",
      //   enableHiding: false,
      //   header: "Account Name",
      //   Cell: ({ row }) => (
      //     <Link to={`/deals/show/${row.original.id}`} className="rowName">
      //       {row.original.accountName}
      //     </Link>
      //   ),
      // },
      // {
      //   accessorKey: "contactName",
      //   enableHiding: false,
      //   header: "Contact Name",
      // },
      {
        accessorKey: "dealOwner",
        enableHiding: false,
        header: "Deal Owner",
      },
      {
        accessorKey: "accountNumber",
        enableHiding: false,
        header: "Account Number",
      },
      {
        accessorKey: "phone",
        enableHiding: false,
        header: "Phone",
      },
      {
        accessorKey: "email",
        enableHiding: false,
        header: "Email",
      },
      {
        accessorKey: "amount",
        header: "Amount",
      },
      {
        accessorKey: "closingDate",
        header: "Closing Date",
        Cell: ({ row }) =>
          new Date(row.original.closingDate).toLocaleDateString(),
      },
      {
        accessorKey: "leadSource",
        header: "Lead Source",
      },
      {
        accessorKey: "stage",
        header: "Stage",
      },
      {
        accessorKey: "probability",
        header: "Probability",
      },
      {
        accessorKey: "campaignSource",
        header: "Campaign Source",
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
        accessorKey: "billingCountry",
        header: "Billing Country",
      },
      {
        accessorKey: "descriptionInfo",
        header: "Description",
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
    ],
    []
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios(
        `${API_URL}allDealsByCompanyId/${companyId}`,
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
    navigate("/deals/create");
  };
  const handleExportRowsPDF = (rows) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Deals", 15, 15);

    const tableHeaders1 = [
      "S.no",
      "Deal Name",
      "Account Name",
      "Contact Name",
      "Deal Owner",
      "Amount",
    ];
    const tableData1 = rows.map((row, i) => {
      return [
        i + 1,
        row.original.dealName,
        row.original.accountName,
        row.original.contactName,
        row.original.dealOwner,
        row.original.amount,
      ];
    });

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

    const tableHeaders2 = [
      "Closing Date",
      "Lead Source",
      "Stage",
      "Probability",
      "Campaign Source",
    ];
    const tableData2 = rows.map((row) => {
      return [
        row.original.closingDate,
        row.original.leadSource,
        row.original.stage,
        row.original.probability,
        row.original.campaignSource,
      ];
    });
    autoTable(doc, {
      head: [tableHeaders2],
      body: tableData2,
      styles: {
        cellPadding: 1,
        fontSize: 10,
        cellWidth: "auto",
        cellHeight: "auto",
      },
    });

    const tableHeaders3 = [
      "Shipping Street",
      "Shipping City",
      "Shipping State",
      "Shipping Code",
      "Shipping Country",
    ];
    const tableData3 = rows.map((row) => {
      return [
        row.original.shippingStreet,
        row.original.shippingCity,
        row.original.shippingState,
        row.original.shippingCode,
        row.original.shippingCountry,
      ];
    });
    autoTable(doc, {
      head: [tableHeaders3],
      body: tableData3,
      styles: {
        cellPadding: 1,
        fontSize: 10,
        cellWidth: "auto",
        cellHeight: "auto",
      },
    });
    const tableHeaders4 = [
      "Billing Street",
      "Billing City",
      "Billing State",
      "Billing Code",
      "Billing Country",
    ];
    const tableData4 = rows.map((row) => {
      return [
        row.original.billingStreet,
        row.original.billingCity,
        row.original.billingState,
        row.original.billingCode,
        row.original.billingCountry,
      ];
    });
    autoTable(doc, {
      head: [tableHeaders4],
      body: tableData4,
      styles: {
        cellPadding: 1,
        fontSize: 10,
        cellWidth: "auto",
        cellHeight: "auto",
      },
    });
    const tableHeaders5 = ["Description", "CreatedAt", "UpdatedAt"];
    const tableData5 = rows.map((row) => {
      return [
        row.original.descriptionInfo,
        row.original.createdAt,
        row.original.updatedAt,
      ];
    });
    autoTable(doc, {
      head: [tableHeaders5],
      body: tableData5,
      styles: {
        cellPadding: 1,
        fontSize: 10,
        cellWidth: "auto",
        cellHeight: "auto",
      },
    });

    doc.save("ECS.pdf");
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
    const rowData = rows.map((row) => row.original.id);
    const formattedRowData = rowData.join(",");

    const formData = new FormData();
    formData.append("dealIds", formattedRowData);
    formData.append("ownerName", owner);

    try {
      const response = await axios.post(
        `${API_URL}dealToAccountConvertMultiple`,
        formData
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/deals");
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
        `${API_URL}dealToAccountConvert/${id}?ownerName=${owner}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/deals");
        fetchData();
        table.setRowSelection(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error Submiting Data");
    }
  };

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      columnVisibility: {
        deal_owner: false,
        leadSource: false,
        lead_status: false,
        amount: false,
        closingDate: false,
        campaignSource: false,
        probability: false,
        stage: false,
        descriptionInfo: false,
        skypeId: false,
        twitter: false,
        sources: false,

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
        </OverlayTrigger>

        <button
          className="btn text-secondary"
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRowsPDF(table.getPrePaginationRowModel().rows)
          }
        >
          <MdPictureAsPdf size={23} />
        </button>
        <OverlayTrigger
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
        </OverlayTrigger>
      </Box>
    ),
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        navigate(`/deals/show/${row.original.id}`);
      },
      style: { cursor: "pointer" },
    }),
  });

  const handleAssignInvoice = async (rows) => {
    const rowData = rows.map((row) => row.original.id);
    setRowMultipleId(rowData);
    table.setRowSelection(false);
  };

  return (
    <section>
      {loading && <LinearProgress />}
      {!loading && (
        <>
          <div className="d-flex align-items-center justify-content-between">
            <div className="text-start">
              <span className="fs-4 fw-bold px-2">Deals</span>
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
                  Create Deals
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
                        handleAssignInvoice(table.getSelectedRowModel().rows)
                      }
                    >
                      <InvoiceMultipleModel
                        dealIds={rowMultipleId}
                        getData={fetchData}
                        path={`associateInvoiceWithMultipleDeals`}
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
                        ) || table.getSelectedRowModel().rows.length !== 1
                      }
                      onClick={() =>
                        handleDealConvert(table.getSelectedRowModel().rows)
                      }
                    >
                      Delete
                    </button>
                  </li>
                  <li>
                    {/* <button
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
                    </button> */}
                  </li>
                  <li>
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
                  </li>
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

export default Deals;
