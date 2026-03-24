import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { Container, Typography, IconButton, Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DataGrid } from "@mui/x-data-grid";

const Tables = () => {
  const { authFetch } = useAuth();
  const [loading, setLoading] = useState(true);
  const [siteData, setSiteData] = useState([]);
  const navigate = useNavigate();

  const columns = [
    // { field: '_id', headerName: 'ID', width: 90 },
    {
      field: "siteName",
      headerName: "Site Name",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "location",
      headerName: "Location",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "type",
      headerName: "Type",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "installationDate",
      headerName: "Installation Date",
      width: 200,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) => {
        if (!params) return "sdf";
        const date = new Date(params);
        return date.toLocaleString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Tooltip title="More actions">
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
              // Handle click action here
              console.log("More button clicked for row:", params.row);
              navigate(`/admin/sheets?siteId=${params.row._id}`);
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
      ),
    },
    // { field: 'status', headerName: 'Status', width: 130 }
  ];

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        setLoading(true);
        const response = await authFetch(
          `${import.meta.env.VITE_BACKEND_URL}sites`
        );
        const data = await response.json();
        setSiteData(data);
      } catch (error) {
        console.error("Error fetching site data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteData();
  }, [authFetch]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <DataGrid
          rows={siteData}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25, { value: -1, label: "All" }]}
        />
      )}
    </Container>
  );
};

export default Tables;
