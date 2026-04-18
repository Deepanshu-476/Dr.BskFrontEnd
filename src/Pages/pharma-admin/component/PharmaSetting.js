import React from 'react'

const PharmaSetting = () => {
    return (
        <div>
      
            <div className="settings-container">
                <div className="settings-header">
                    <h2>Settings</h2>
                    <p className="settings-subtitle">Manage your application configuration</p>
                </div>

                <div className="settings-card">
                    <form className="settings-form">
                        <div className="form-group">
                            <label htmlFor="siteTitle">Site Title</label>
                            <input
                                type="text"
                                id="siteTitle"
                                defaultValue="My Admin Panel"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="adminEmail">Admin Email</label>
                            <input
                                type="email"
                                id="adminEmail"
                                defaultValue="admin@example.com"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="timezone">Timezone</label>
                            <select id="timezone" defaultValue="UTC" className="form-input">
                                <option value="UTC">UTC (Coordinated Universal Time)</option>
                                <option value="EST">EST (Eastern Standard Time)</option>
                                <option value="PST">PST (Pacific Standard Time)</option>
                            </select>
                        </div>

                        <div className="form-group switch-group">
                            <label>Maintenance Mode</label>
                            <div className="switch-container">
                                <label className="switch">
                                    <input type="checkbox" id="maintenance" />
                                    <span className="slider round"></span>
                                </label>
                                <span className="switch-label">Turn maintenance mode on/off</span>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary">Reset</button>
                            <button type="submit" className="btn btn-primary">Save Settings</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PharmaSetting
