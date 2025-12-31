import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function DataTable({
    columns,
    data,
    onRowClick,
    loading,
    emptyMessage = 'No data available'
}) {
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    const handleSort = (column) => {
        if (!column.sortable) return;

        if (sortColumn === column.key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column.key);
            setSortDirection('asc');
        }
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortColumn) return 0;

        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (typeof aVal === 'string') {
            return sortDirection === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }

        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    if (loading) {
        return (
            <div className="table-container">
                <div style={{ padding: 'var(--spacing-8)', textAlign: 'center' }}>
                    <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
                    <p style={{ marginTop: 'var(--spacing-4)', color: 'var(--color-text-muted)' }}>
                        Loading data...
                    </p>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="table-container">
                <div className="empty-state">
                    <p className="empty-state-title">No Data</p>
                    <p className="empty-state-text">{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                onClick={() => handleSort(column)}
                                className={`
                  ${column.sortable ? 'sortable' : ''}
                  ${sortColumn === column.key ? (sortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc') : ''}
                `}
                                style={{ width: column.width || 'auto' }}
                            >
                                <div className="flex items-center gap-2">
                                    {column.label}
                                    {column.sortable && sortColumn === column.key && (
                                        sortDirection === 'asc'
                                            ? <ChevronUp size={14} />
                                            : <ChevronDown size={14} />
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((row, index) => (
                        <tr
                            key={row.id || index}
                            onClick={() => onRowClick && onRowClick(row)}
                            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                        >
                            {columns.map((column) => (
                                <td key={column.key}>
                                    {column.render
                                        ? column.render(row[column.key], row)
                                        : row[column.key]
                                    }
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
