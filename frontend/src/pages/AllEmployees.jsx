import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Download, Filter, Search } from 'lucide-react';
import api from '../api/client';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';

export default function AllEmployees() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [weeks, setWeeks] = useState([]);
    const [selectedWeek, setSelectedWeek] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        fetchData();
    }, [selectedWeek, sortBy, sortOrder]); // Status filter NOT included - handled on frontend

    const fetchData = async () => {
        try {
            setLoading(true);
            const params = {
                sort_by: sortBy,
                sort_order: sortOrder
            };

            if (selectedWeek) params.week_start = selectedWeek;
            // Note: status_filter NOT sent to API - filtering done on frontend

            const data = await api.getAllEmployeesReport(params);
            setEmployees(data.employees || []);
            setWeeks(data.available_weeks || []);
        } catch (err) {
            console.error('Error fetching employees:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            await api.exportAllEmployees(selectedWeek);
        } catch (err) {
            console.error('Export error:', err);
        }
    };

    const filteredEmployees = employees.filter(emp => {
        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const matchesSearch = (
                emp.employee_name?.toLowerCase().includes(term) ||
                emp.employee_code?.toLowerCase().includes(term)
            );
            if (!matchesSearch) return false;
        }

        // Status filter
        if (statusFilter) {
            if (statusFilter === 'compliant') {
                // Compliant = GREEN or AMBER (not RED)
                return emp.status !== 'RED';
            } else if (statusFilter === 'RED') {
                // Non-compliant = RED only
                return emp.status === 'RED';
            } else {
                // Other status filters (GREEN, AMBER)
                return emp.status === statusFilter;
            }
        }

        return true;
    });

    const columns = [
        {
            key: 'employee_name',
            label: 'Employee',
            sortable: true,
            render: (value, row) => (
                <div className="cell-employee">
                    <div className="employee-avatar">
                        {value?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="employee-info">
                        <span className="employee-name">{value}</span>
                        <span className="employee-code">ID: {row.employee_code}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'department',
            label: 'Department',
            sortable: true,
            render: (value) => value || '-'
        },
        {
            key: 'total_office_hours',
            label: 'Total Hours',
            sortable: true
        },
        {
            key: 'wfo_days',
            label: 'WFO Days',
            sortable: true,
            render: (value, row) => (
                <span>
                    <span className="font-medium">{value}</span>
                    <span className="text-muted"> / {row.required_wfo_days}</span>
                </span>
            )
        },
        {
            key: 'expected_hours',
            label: 'Expected',
            sortable: false
        },
        {
            key: 'compliance_percentage',
            label: 'Compliance',
            sortable: true,
            render: (value, row) => (
                <div className="flex items-center gap-3">
                    <div className="progress-bar" style={{ width: '80px' }}>
                        <div
                            className={`progress-fill ${row.status?.toLowerCase()}`}
                            style={{ width: `${Math.min(value, 100)}%` }}
                        />
                    </div>
                    <span className="font-medium">{value?.toFixed(1)}%</span>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value) => <StatusBadge status={value} />
        }
    ];

    return (
        <div className="animate-fade-in">
            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">All Employees Report</h1>
                <p className="page-subtitle">
                    View and analyze attendance data for all employees
                </p>
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--spacing-4)',
                    alignItems: 'end'
                }}>
                    {/* Search by Name */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Name</label>
                        <div style={{ position: 'relative' }}>
                            <Search
                                size={18}
                                style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-text-muted)',
                                    pointerEvents: 'none'
                                }}
                            />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search by name or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ paddingLeft: '40px' }}
                            />
                        </div>
                    </div>

                    {/* Week Filter */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Week</label>
                        <select
                            className="form-input form-select"
                            value={selectedWeek}
                            onChange={(e) => setSelectedWeek(e.target.value)}
                        >
                            <option value="">Latest Week</option>
                            {weeks.map((week) => (
                                <option key={week.week_start} value={week.week_start}>
                                    {week.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Status</label>
                        <select
                            className="form-input form-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="GREEN">Excellent (&gt;90%)</option>
                            <option value="AMBER">Meets Target (70-90%)</option>
                            <option value="RED">Below Target (&lt;70%)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Rich Stats Summary */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--spacing-4)',
                marginBottom: 'var(--spacing-6)'
            }}>
                {/* Employees Present This Week - Fixed, not filtered */}
                <div
                    className="card"
                    style={{ textAlign: 'center', padding: 'var(--spacing-4)', cursor: 'pointer' }}
                    onClick={() => setStatusFilter('')}
                >
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold' }}>
                        {employees.length}
                    </div>
                    <div className="text-muted">Employees Present This Week</div>
                </div>

                {/* Avg Compliance - Based on filtered data */}
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                        {(filteredEmployees.reduce((acc, emp) => acc + emp.compliance_percentage, 0) / (filteredEmployees.length || 1)).toFixed(1)}%
                    </div>
                    <div className="text-muted">Avg Compliance</div>
                </div>

                {/* Compliant (>70%) - Based on filtered data */}
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-4)', background: 'var(--color-status-green-bg)', borderColor: 'var(--color-status-green-border)' }}>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--color-status-green)' }}>
                        {filteredEmployees.filter(e => e.status !== 'RED').length}
                    </div>
                    <div className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Compliant (&gt;70%)</div>
                    <div className="text-muted" style={{ fontSize: 'var(--font-size-xs)', marginTop: '4px' }}>Meets Target &amp; Excellent</div>
                </div>

                {/* Non-Compliant (<70%) - Based on filtered data */}
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-4)', background: 'var(--color-status-red-bg)', borderColor: 'var(--color-status-red-border)' }}>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--color-status-red)' }}>
                        {filteredEmployees.filter(e => e.status === 'RED').length}
                    </div>
                    <div className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Non-Compliant (&lt;70%)</div>
                    <div className="text-muted" style={{ fontSize: 'var(--font-size-xs)', marginTop: '4px' }}>Below Target</div>
                </div>
            </div>

            {/* Data Table */}
            <div className="table-container">
                <div className="table-header">
                    <h3 className="table-title">
                        {filteredEmployees.length} Employee{filteredEmployees.length !== 1 ? 's' : ''}
                    </h3>
                    <button className="btn btn-primary" onClick={handleExport}>
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>
                <DataTable
                    columns={columns}
                    data={filteredEmployees}
                    loading={loading}
                    onRowClick={(row) => navigate(`/employee/${row.employee_code}`)}
                    emptyMessage="No employees found. Try adjusting your filters or upload attendance data."
                />
            </div>
        </div>
    );
}
