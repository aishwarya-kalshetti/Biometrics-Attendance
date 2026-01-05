import { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import api from '../api/client';

export default function Settings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await api.getSettings();
            setSettings(data);
        } catch (err) {
            console.error('Error fetching settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await api.updateSettings({
                expected_hours_per_day: settings?.expected_hours_per_day || 8,
                wfo_days_per_week: settings?.wfo_days_per_week || 3,
                wfh_days_per_week: settings?.wfh_days_per_week || 2,
                threshold_red: settings?.thresholds?.red || 70,
                threshold_amber: settings?.thresholds?.amber || 90,
                min_hours_for_present: settings?.min_hours_for_present || 6
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error('Error saving settings:', err);
            alert('Failed to save settings. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">
                    Configure attendance policies and thresholds
                </p>
            </div>

            {/* Work Policy Settings */}
            <div className="card mb-6">
                <h3 className="card-title mb-6">Hybrid Work Policy</h3>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 'var(--spacing-6)'
                }}>
                    <div className="form-group">
                        <label className="form-label">Expected Hours Per WFO Day</label>
                        <input
                            type="number"
                            className="form-input"
                            value={settings?.expected_hours_per_day || 8}
                            onChange={(e) => setSettings({
                                ...settings,
                                expected_hours_per_day: parseInt(e.target.value)
                            })}
                            min="1"
                            max="12"
                        />
                        <p style={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-muted)',
                            marginTop: 'var(--spacing-1)'
                        }}>
                            Standard working hours expected per office day
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">WFO Days Per Week</label>
                        <input
                            type="number"
                            className="form-input"
                            value={settings?.wfo_days_per_week || 3}
                            onChange={(e) => setSettings({
                                ...settings,
                                wfo_days_per_week: parseInt(e.target.value)
                            })}
                            min="1"
                            max="5"
                        />
                        <p style={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-muted)',
                            marginTop: 'var(--spacing-1)'
                        }}>
                            Required office days per week
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">WFH Days Per Week</label>
                        <input
                            type="number"
                            className="form-input"
                            value={settings?.wfh_days_per_week || 2}
                            onChange={(e) => setSettings({
                                ...settings,
                                wfh_days_per_week: parseInt(e.target.value)
                            })}
                            min="0"
                            max="5"
                        />
                        <p style={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-muted)',
                            marginTop: 'var(--spacing-1)'
                        }}>
                            Work from home days per week
                        </p>
                    </div>
                </div>

                {/* Calculated Weekly Expected */}
                <div style={{
                    marginTop: 'var(--spacing-6)',
                    padding: 'var(--spacing-4)',
                    background: 'var(--color-surface-elevated)',
                    borderRadius: 'var(--radius-lg)'
                }}>
                    <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                        Expected Weekly Office Hours:
                        <span className="font-bold text-primary" style={{ marginLeft: 'var(--spacing-2)' }}>
                            {(settings?.wfo_days_per_week || 3) * (settings?.expected_hours_per_day || 8)} hours
                        </span>
                        <span className="text-muted" style={{ marginLeft: 'var(--spacing-2)' }}>
                            ({settings?.expected_weekly_minutes || 960} minutes)
                        </span>
                    </p>
                </div>

                {/* Minimum Hours for Present */}
                <div style={{ marginTop: 'var(--spacing-6)' }}>
                    <div className="form-group">
                        <label className="form-label">Minimum Hours for Present</label>
                        <input
                            type="number"
                            className="form-input"
                            value={settings?.min_hours_for_present || 6}
                            onChange={(e) => setSettings({
                                ...settings,
                                min_hours_for_present: parseInt(e.target.value)
                            })}
                            min="1"
                            max="12"
                            style={{ maxWidth: '200px' }}
                        />
                        <p style={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-muted)',
                            marginTop: 'var(--spacing-1)'
                        }}>
                            Employees must work at least this many hours to be counted as PRESENT for a day
                        </p>
                    </div>
                </div>
            </div>

            {/* Compliance Definition */}
            <div className="card mb-6">
                <h3 className="card-title mb-4">What is Compliance?</h3>
                <div style={{
                    padding: 'var(--spacing-4)',
                    background: 'var(--color-surface-elevated)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--spacing-4)'
                }}>
                    <p style={{ marginBottom: 'var(--spacing-3)', lineHeight: '1.6' }}>
                        <strong>Compliance Percentage</strong> measures how well an employee meets their expected work hours:
                    </p>
                    <div style={{
                        fontFamily: 'monospace',
                        background: 'var(--color-surface)',
                        padding: 'var(--spacing-3)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--spacing-3)'
                    }}>
                        Compliance % = (Actual Hours Worked ÷ Expected Hours) × 100
                    </div>
                    <ul style={{ paddingLeft: 'var(--spacing-4)', lineHeight: '1.8' }}>
                        <li><strong>Expected Hours</strong> = WFO Days × Hours per WFO Day</li>
                        <li><strong>Actual Hours</strong> = Total hours employee worked in office</li>
                        <li>Employees with &gt; 100% compliance have worked overtime</li>
                    </ul>
                </div>
            </div>

            {/* Compliance Thresholds */}
            <div className="card mb-6">
                <h3 className="card-title mb-6">Compliance Thresholds (Configurable)</h3>

                <p className="text-muted mb-4" style={{ fontSize: 'var(--font-size-sm)' }}>
                    Set the percentage thresholds that determine employee compliance status
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 'var(--spacing-6)'
                }}>
                    {/* Red Threshold Input */}
                    <div style={{
                        padding: 'var(--spacing-4)',
                        background: 'var(--color-status-red-bg)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-status-red-border)'
                    }}>
                        <div className="flex items-center gap-2 mb-3">
                            <span style={{
                                width: '12px',
                                height: '12px',
                                background: 'var(--color-status-red)',
                                borderRadius: 'var(--radius-full)'
                            }}></span>
                            <span className="font-medium">Below Target (Non-Compliant)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>&lt;</span>
                            <input
                                type="number"
                                className="form-input"
                                value={settings?.thresholds?.red || 70}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    thresholds: {
                                        ...settings?.thresholds,
                                        red: parseInt(e.target.value)
                                    }
                                })}
                                min="0"
                                max="100"
                                style={{ width: '80px', textAlign: 'center' }}
                            />
                            <span>%</span>
                        </div>
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--spacing-2)' }}>
                            Employees below this % need improvement
                        </p>
                    </div>

                    {/* Amber Threshold Input */}
                    <div style={{
                        padding: 'var(--spacing-4)',
                        background: 'var(--color-status-amber-bg)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-status-amber-border)'
                    }}>
                        <div className="flex items-center gap-2 mb-3">
                            <span style={{
                                width: '12px',
                                height: '12px',
                                background: 'var(--color-status-amber)',
                                borderRadius: 'var(--radius-full)'
                            }}></span>
                            <span className="font-medium">Meets Target (Compliant)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>{settings?.thresholds?.red || 70}% -</span>
                            <input
                                type="number"
                                className="form-input"
                                value={settings?.thresholds?.amber || 90}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    thresholds: {
                                        ...settings?.thresholds,
                                        amber: parseInt(e.target.value)
                                    }
                                })}
                                min="0"
                                max="100"
                                style={{ width: '80px', textAlign: 'center' }}
                            />
                            <span>%</span>
                        </div>
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--spacing-2)' }}>
                            Satisfactory performance range
                        </p>
                    </div>

                    {/* Green Threshold (Display Only) */}
                    <div style={{
                        padding: 'var(--spacing-4)',
                        background: 'var(--color-status-green-bg)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-status-green-border)'
                    }}>
                        <div className="flex items-center gap-2 mb-3">
                            <span style={{
                                width: '12px',
                                height: '12px',
                                background: 'var(--color-status-green)',
                                borderRadius: 'var(--radius-full)'
                            }}></span>
                            <span className="font-medium">Excellent (Top Performer)</span>
                        </div>
                        <p className="text-green font-bold" style={{ fontSize: 'var(--font-size-xl)' }}>
                            &gt; {settings?.thresholds?.amber || 90}%
                        </p>
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--spacing-2)' }}>
                            Outstanding compliance
                        </p>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4">
                <button className="btn btn-primary" onClick={handleSave}>
                    <Save size={18} />
                    Save Settings
                </button>

                <button className="btn btn-secondary" onClick={fetchSettings}>
                    <RefreshCw size={18} />
                    Reset to Defaults
                </button>

                {saved && (
                    <span className="text-green" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-2)'
                    }}>
                        ✓ Settings saved successfully
                    </span>
                )}
            </div>
        </div>
    );
}
