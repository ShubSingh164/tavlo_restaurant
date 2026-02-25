'use client';

/**
 * Tavlo Restaurant ERP - Add Staff Page
 * 
 * Professional form for adding new staff members with:
 * - Personal information (name, email, phone)
 * - Role and department selection
 * - Profile photo upload
 * - Shift preferences
 * - Emergency contact
 * 
 * @route /staff/add
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './page.module.css';

// Icons
const BackIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);

const UserIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const CameraIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

// Staff role options
const staffRoles = [
    { id: 'chef', label: 'Chef', description: 'Kitchen staff responsible for food preparation' },
    { id: 'waiter', label: 'Waiter/Waitress', description: 'Front-of-house serving staff' },
    { id: 'manager', label: 'Manager', description: 'Supervisory and management role' },
    { id: 'cashier', label: 'Cashier', description: 'Handles billing and payments' },
    { id: 'host', label: 'Host/Hostess', description: 'Greets and seats customers' },
    { id: 'bartender', label: 'Bartender', description: 'Prepares and serves beverages' },
    { id: 'cleaner', label: 'Cleaning Staff', description: 'Maintains cleanliness and hygiene' },
];

// Shift options
const shiftOptions = [
    { id: 'morning', label: 'Morning Shift', time: '06:00 AM - 02:00 PM' },
    { id: 'afternoon', label: 'Afternoon Shift', time: '02:00 PM - 10:00 PM' },
    { id: 'night', label: 'Night Shift', time: '10:00 PM - 06:00 AM' },
    { id: 'flexible', label: 'Flexible', time: 'As per requirement' },
];

interface StaffFormData {
    // Personal Info
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    city: string;
    pincode: string;
    // Professional Info
    role: string;
    department: string;
    joiningDate: string;
    salary: string;
    employmentType: string;
    // Shift Preferences
    preferredShift: string;
    workingDays: string[];
    // Emergency Contact
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
    // Photo
    photo: string;
}

export default function AddStaffPage() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [activeSection, setActiveSection] = useState('personal');
    const [formData, setFormData] = useState<StaffFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        city: '',
        pincode: '',
        role: '',
        department: 'kitchen',
        joiningDate: new Date().toISOString().split('T')[0],
        salary: '',
        employmentType: 'full-time',
        preferredShift: 'morning',
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: '',
        photo: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleWorkingDayToggle = (day: string) => {
        setFormData(prev => ({
            ...prev,
            workingDays: prev.workingDays.includes(day)
                ? prev.workingDays.filter(d => d !== day)
                : [...prev.workingDays, day]
        }));
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData(prev => ({
                    ...prev,
                    photo: event.target?.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.role) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSaving(true);

        // Create new staff member
        const newStaff = {
            _id: `staff_${Date.now()}`,
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            status: 'off-duty',
            avatar: formData.photo || null,
            shift: formData.preferredShift,
            ordersHandled: 0,
            salesAmount: 0,
            rating: 5.0,
            joinedAt: formData.joiningDate,
        };

        // Store in localStorage
        const storedStaff = localStorage.getItem('newStaffMembers');
        const staffList = storedStaff ? JSON.parse(storedStaff) : [];
        staffList.push(newStaff);
        localStorage.setItem('newStaffMembers', JSON.stringify(staffList));

        await new Promise(resolve => setTimeout(resolve, 500));

        setIsSaving(false);
        router.push('/staff');
    };

    const sections = [
        { id: 'personal', label: 'Personal Info', icon: '👤' },
        { id: 'professional', label: 'Professional', icon: '💼' },
        { id: 'schedule', label: 'Schedule', icon: '📅' },
        { id: 'emergency', label: 'Emergency', icon: '🚨' },
    ];

    const workingDaysOptions = [
        { id: 'monday', label: 'Mon' },
        { id: 'tuesday', label: 'Tue' },
        { id: 'wednesday', label: 'Wed' },
        { id: 'thursday', label: 'Thu' },
        { id: 'friday', label: 'Fri' },
        { id: 'saturday', label: 'Sat' },
        { id: 'sunday', label: 'Sun' },
    ];

    return (
        
            <div className={styles.addStaffPage}>
                {/* Header */}
                <header className={styles.header}>
                    <button className={styles.backBtn} onClick={() => router.back()}>
                        <BackIcon />
                        <span>Back to Staff</span>
                    </button>
                    <div className={styles.headerActions}>
                        <button type="button" className={styles.cancelBtn} onClick={() => router.back()}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="addStaffForm"
                            className={styles.saveBtn}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Adding...' : 'Add Staff Member'}
                        </button>
                    </div>
                </header>

                <div className={styles.formContainer}>
                    {/* Section Navigation */}
                    <nav className={styles.sectionNav}>
                        {sections.map(section => (
                            <button
                                key={section.id}
                                className={`${styles.sectionNavItem} ${activeSection === section.id ? styles.active : ''}`}
                                onClick={() => setActiveSection(section.id)}
                            >
                                <span className={styles.sectionIcon}>{section.icon}</span>
                                <span className={styles.sectionLabel}>{section.label}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Form */}
                    <form id="addStaffForm" className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formContent}>
                            {/* Photo Upload - Always visible */}
                            <div className={styles.photoSection}>
                                <div className={styles.photoUpload}>
                                    {formData.photo ? (
                                        <div className={styles.photoPreview}>
                                            <img src={formData.photo} alt="Staff preview" />
                                            <label className={styles.changePhotoBtn}>
                                                <CameraIcon />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePhotoUpload}
                                                    hidden
                                                />
                                            </label>
                                        </div>
                                    ) : (
                                        <label className={styles.uploadArea}>
                                            <UserIcon />
                                            <span className={styles.uploadText}>Upload Photo</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoUpload}
                                                hidden
                                            />
                                        </label>
                                    )}
                                </div>
                                <p className={styles.photoHint}>Recommended: 200x200px square image</p>
                            </div>

                            {/* Personal Information Section */}
                            {activeSection === 'personal' && (
                                <section className={styles.section}>
                                    <h3 className={styles.sectionTitle}>Personal Information</h3>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>First Name <span className={styles.required}>*</span></label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                className={styles.input}
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                placeholder="Enter first name"
                                                required
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Last Name <span className={styles.required}>*</span></label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                className={styles.input}
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                placeholder="Enter last name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className={styles.input}
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="staff@restaurant.com"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Phone Number <span className={styles.required}>*</span></label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                className={styles.input}
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="+91 XXXXX XXXXX"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Date of Birth</label>
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                className={styles.input}
                                                value={formData.dateOfBirth}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Gender</label>
                                            <select
                                                name="gender"
                                                className={styles.select}
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Address</label>
                                        <textarea
                                            name="address"
                                            className={styles.textarea}
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Enter full address"
                                            rows={2}
                                        />
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                className={styles.input}
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="City name"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>PIN Code</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                className={styles.input}
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                placeholder="XXXXXX"
                                            />
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Professional Information Section */}
                            {activeSection === 'professional' && (
                                <section className={styles.section}>
                                    <h3 className={styles.sectionTitle}>Professional Information</h3>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Select Role <span className={styles.required}>*</span></label>
                                        <div className={styles.roleGrid}>
                                            {staffRoles.map(role => (
                                                <label
                                                    key={role.id}
                                                    className={`${styles.roleCard} ${formData.role === role.id ? styles.selected : ''}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="role"
                                                        value={role.id}
                                                        checked={formData.role === role.id}
                                                        onChange={handleInputChange}
                                                    />
                                                    <span className={styles.roleLabel}>{role.label}</span>
                                                    <span className={styles.roleDesc}>{role.description}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Department</label>
                                            <select
                                                name="department"
                                                className={styles.select}
                                                value={formData.department}
                                                onChange={handleInputChange}
                                            >
                                                <option value="kitchen">Kitchen</option>
                                                <option value="front-of-house">Front of House</option>
                                                <option value="management">Management</option>
                                                <option value="maintenance">Maintenance</option>
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Employment Type</label>
                                            <select
                                                name="employmentType"
                                                className={styles.select}
                                                value={formData.employmentType}
                                                onChange={handleInputChange}
                                            >
                                                <option value="full-time">Full Time</option>
                                                <option value="part-time">Part Time</option>
                                                <option value="contract">Contract</option>
                                                <option value="intern">Internship</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Joining Date</label>
                                            <input
                                                type="date"
                                                name="joiningDate"
                                                className={styles.input}
                                                value={formData.joiningDate}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Monthly Salary (₹)</label>
                                            <input
                                                type="number"
                                                name="salary"
                                                className={styles.input}
                                                value={formData.salary}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 25000"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Schedule Section */}
                            {activeSection === 'schedule' && (
                                <section className={styles.section}>
                                    <h3 className={styles.sectionTitle}>Work Schedule</h3>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Preferred Shift</label>
                                        <div className={styles.shiftGrid}>
                                            {shiftOptions.map(shift => (
                                                <label
                                                    key={shift.id}
                                                    className={`${styles.shiftCard} ${formData.preferredShift === shift.id ? styles.selected : ''}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="preferredShift"
                                                        value={shift.id}
                                                        checked={formData.preferredShift === shift.id}
                                                        onChange={handleInputChange}
                                                    />
                                                    <span className={styles.shiftLabel}>{shift.label}</span>
                                                    <span className={styles.shiftTime}>{shift.time}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Working Days</label>
                                        <div className={styles.daysGrid}>
                                            {workingDaysOptions.map(day => (
                                                <button
                                                    key={day.id}
                                                    type="button"
                                                    className={`${styles.dayBtn} ${formData.workingDays.includes(day.id) ? styles.selected : ''}`}
                                                    onClick={() => handleWorkingDayToggle(day.id)}
                                                >
                                                    {day.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Emergency Contact Section */}
                            {activeSection === 'emergency' && (
                                <section className={styles.section}>
                                    <h3 className={styles.sectionTitle}>Emergency Contact</h3>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Contact Name</label>
                                        <input
                                            type="text"
                                            name="emergencyContactName"
                                            className={styles.input}
                                            value={formData.emergencyContactName}
                                            onChange={handleInputChange}
                                            placeholder="Full name of emergency contact"
                                        />
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Contact Phone</label>
                                            <input
                                                type="tel"
                                                name="emergencyContactPhone"
                                                className={styles.input}
                                                value={formData.emergencyContactPhone}
                                                onChange={handleInputChange}
                                                placeholder="+91 XXXXX XXXXX"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Relationship</label>
                                            <select
                                                name="emergencyContactRelation"
                                                className={styles.select}
                                                value={formData.emergencyContactRelation}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select Relationship</option>
                                                <option value="parent">Parent</option>
                                                <option value="spouse">Spouse</option>
                                                <option value="sibling">Sibling</option>
                                                <option value="friend">Friend</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className={styles.infoBox}>
                                        <span className={styles.infoIcon}>ℹ️</span>
                                        <p>Emergency contact will only be used in case of workplace emergencies and will be kept confidential.</p>
                                    </div>
                                </section>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        
    );
}
