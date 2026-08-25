import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

import batchService from "../../services/batchService";
import DataTable from "../../components/tables/DataTable";
import { formatStatus } from "../../utils/formatters";

export default function Batches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBatches();
  }, []);

  async function loadBatches() {
    try {
      setLoading(true);

      const response = await batchService.list();

      setBatches(
        response.data?.content ||
        response.data ||
        []
      );
    } catch {
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = batches.filter((batch) =>
    `${batch.batchCode || ""} ${batch.courseName || ""} ${batch.trainerName || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "batchCode",
      label: "Batch"
    },
    {
      key: "courseName",
      label: "Course"
    },
    {
      key: "trainerName",
      label: "Trainer",
      render: (value) => value || "Unassigned"
    },
    {
      key: "mode",
      label: "Mode",
      render: (value) => formatStatus(value || "")
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span className="status-badge">
          {formatStatus(value || "UPCOMING")}
        </span>
      )
    },
    {
      key: "startDate",
      label: "Starts"
    },
    {
      key: "capacity",
      label: "Capacity"
    }
  ];

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Batches</h2>
          <p>
            Scheduled course runs and trainer assignments.
          </p>
        </div>

        <button className="primary-button">
          <Plus size={18} />
          Add Batch
        </button>
      </div>

      <div className="panel">
        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              placeholder="Search batches..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
        />
      </div>
    </div>
  );
}
