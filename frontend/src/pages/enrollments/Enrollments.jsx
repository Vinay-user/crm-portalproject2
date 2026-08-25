import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

import enrollmentService from "../../services/enrollmentService";
import DataTable from "../../components/tables/DataTable";
import { formatCurrency, formatStatus } from "../../utils/formatters";

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadEnrollments();
  }, []);

  async function loadEnrollments() {
    try {
      setLoading(true);

      const response = await enrollmentService.list();

      setEnrollments(
        response.data?.content ||
        response.data ||
        []
      );
    } catch {
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = enrollments.filter((enrollment) =>
    `${enrollment.contactName || ""} ${enrollment.courseName || ""} ${enrollment.companyName || ""} ${enrollment.batchCode || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "contactName",
      label: "Trainee"
    },
    {
      key: "courseName",
      label: "Course",
      render: (value, row) => value ? `${value} (${row.batchCode || ""})` : row.batchCode
    },
    {
      key: "companyName",
      label: "Sponsoring Company",
      render: (value) => value || "-"
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span className="status-badge">
          {formatStatus(value || "ENROLLED")}
        </span>
      )
    },
    {
      key: "paymentStatus",
      label: "Payment",
      render: (value) => (
        <span className="status-badge">
          {formatStatus(value || "PENDING")}
        </span>
      )
    },
    {
      key: "feeAmount",
      label: "Fee",
      render: (value) => formatCurrency(value)
    },
    {
      key: "certificateNumber",
      label: "Certificate",
      render: (value) => value || "-"
    }
  ];

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Enrollments</h2>
          <p>
            Trainees enrolled across all batches, and their payment/certificate status.
          </p>
        </div>

        <button className="primary-button">
          <Plus size={18} />
          Add Enrollment
        </button>
      </div>

      <div className="panel">
        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              placeholder="Search enrollments..."
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
