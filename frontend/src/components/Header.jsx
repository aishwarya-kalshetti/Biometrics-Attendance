import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, Search, Sun, Moon } from 'lucide-react';

export default function Header({ title, onMenuClick }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [theme, setTheme] = useState(() => {
        // Get saved theme from localStorage or default to 'dark'
        return localStorage.getItem('theme') || 'dark';
    });

    // Hide header search on pages that have their own search
    const hideSearch = location.pathname === '/employees';

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            // Navigate to All Employees page with search query
            navigate(`/employees?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    return (
        <header className="header">
            <div className="flex items-center gap-4">
                <button
                    className="btn btn-ghost btn-icon"
                    onClick={onMenuClick}
                    style={{ display: 'none' }} // Hidden on desktop
                >
                    <Menu size={20} />
                </button>
                <h1 className="header-title">{title}</h1>
            </div>

            <div className="header-actions">
                {/* Search - hidden on All Employees page */}
                {!hideSearch && (
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
                            placeholder="Search employees..."
                            className="form-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                            style={{
                                paddingLeft: '40px',
                                width: '240px',
                                background: 'var(--color-surface-elevated)'
                            }}
                        />
                    </div>
                )}

                {/* Theme Toggle */}
                <button
                    className="btn btn-ghost btn-icon"
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Notifications */}
                <button className="btn btn-ghost btn-icon" style={{ position: 'relative' }}>
                    <Bell size={20} />
                    <span style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        width: '8px',
                        height: '8px',
                        background: 'var(--color-status-red)',
                        borderRadius: 'var(--radius-full)'
                    }} />
                </button>

                {/* User Avatar */}
                <div className="employee-avatar" style={{ cursor: 'pointer' }}>
                    HR
                </div>
            </div>
        </header>
    );
}
