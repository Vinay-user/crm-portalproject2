import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

import courseService from "../../services/courseService";
import DataTable from "../../components/tables/DataTable";
import { formatCurrency } from "../../utils/formatters";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      setLoading(true);

      const response = await courseService.list();

      setCourses(
        response.data?.content ||
        response.data ||
        []
      );
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = courses.filter((course) =>
    `${course.name || ""} ${course.code || ""} ${course.category || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      label: "Course"
    },
    {
      key: "code",
      label: "Code"
    },
    {
      key: "category",
      label: "Category"
    },
    {
      key: "durationHours",
      label: "Duration",
      render: (value) => (value ? `${value} hrs` : "-")
    },
    {
      key: "fee",
      label: "Fee",
      render: (value, row) => formatCurrency(value, row.currency || "USD")
    },
    {
      key: "isActive",
      label: "Status",
      render: (value) => (
        <span className="status-badge">
          {value ? "Active" : "Inactive"}
        </span>
      )
    }
  ];

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Courses</h2>
          <p>
            Manage the IT training course catalog.
          </p>
        </div>

        <button className="primary-button">
          <Plus size={18} />
          Add Course
        </button>
      </div>

      <div className="panel">
        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              placeholder="Search courses..."
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
