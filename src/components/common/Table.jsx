import React from "react";
import Loader from "./Loader";
import EmptyState from "./EmptyState";

function Table({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No records found.",
  rowKey = (row, index) => row.id || index
}) {
  const renderCellValue = (column, row, index) => {
    const value = column.render ? column.render(row, index) : row[column.key];
    return value == null || value === "" ? "-" : value;
  };

  if (loading) {
    return (
      <div className="rounded-md bg-white p-4">
        <Loader />
      </div>
    );
  }

  if (!data.length) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3 md:hidden">
        {data.map((row, index) => (
          <div key={rowKey(row, index)} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            {columns.map((column) => (
              <div
                key={column.key}
                className="flex items-start justify-between gap-3 border-b border-slate-100 py-2 last:border-b-0"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{column.header}</p>
                <div className="max-w-[65%] text-right text-sm text-slate-700">
                  {renderCellValue(column, row, index)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-md border border-slate-200 bg-white md:block">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, index) => (
              <tr key={rowKey(row, index)} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-slate-700">
                    {renderCellValue(column, row, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;


