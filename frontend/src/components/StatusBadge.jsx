export default function StatusBadge({ status }) {
    const statusClass = status ? status.toLowerCase() : 'red';

    const labels = {
        green: 'Excellent',
        amber: 'Meets Target',
        red: 'Below Target'
    };

    return (
        <span className={`status-badge ${statusClass}`}>
            <span className="status-dot"></span>
            {labels[statusClass] || status}
        </span>
    );
}
