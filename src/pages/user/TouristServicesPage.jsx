import { useState } from 'react';
import { BiCalendar, BiCheck, BiGlobe, BiHome, BiMapPin, BiPhone, BiUpload, BiUser, BiX } from 'react-icons/bi';
import { BsFileCheck } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';
import { FiAlertCircle, FiFileText } from 'react-icons/fi';

const TouristServicesPage = () => {
    const [currentPage, setCurrentPage] = useState('form');
    const [complaintId, setComplaintId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '',
        nationality: 'domestic',
        country: '',
        countryCode: '+91',
        state: '',
        mobile: '',
        email: '',
        complaintType: '',
        location: '',
        incidentDate: '',
        description: '',
        consent: false
    });

    const [errors, setErrors] = useState({});
    const [uploadedFile, setUploadedFile] = useState(null);
    const [showErrorSummary, setShowErrorSummary] = useState(false);

    const countryCodes = [
        { code: '+91', country: 'India', digits: 10 },
        { code: '+1', country: 'USA/Canada', digits: 10 },
        { code: '+44', country: 'UK', digits: 10 },
        { code: '+61', country: 'Australia', digits: 9 },
        { code: '+81', country: 'Japan', digits: 10 },
        { code: '+86', country: 'China', digits: 11 },
        { code: '+33', country: 'France', digits: 9 },
        { code: '+49', country: 'Germany', digits: 11 },
        { code: '+39', country: 'Italy', digits: 10 },
        { code: '+34', country: 'Spain', digits: 9 },
        { code: '+7', country: 'Russia', digits: 10 },
        { code: '+55', country: 'Brazil', digits: 11 },
        { code: '+27', country: 'South Africa', digits: 9 },
        { code: '+971', country: 'UAE', digits: 9 },
        { code: '+65', country: 'Singapore', digits: 8 },
        { code: '+60', country: 'Malaysia', digits: 10 },
        { code: '+66', country: 'Thailand', digits: 9 },
        { code: '+82', country: 'South Korea', digits: 10 },
        { code: '+52', country: 'Mexico', digits: 10 },
        { code: '+54', country: 'Argentina', digits: 10 },
    ];

    const indianStates = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
        'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ];

    const rajasthanCities = [
        'Jaipur', 'Jodhpur', 'Udaipur', 'Jaisalmer', 'Ajmer', 'Pushkar',
        'Bikaner', 'Mount Abu', 'Chittorgarh', 'Kota', 'Alwar', 'Bharatpur',
        'Bundi', 'Ranakpur', 'Mandawa', 'Ranthambore', 'Other'
    ];

    const complaintTypes = [
        'Transport', 'Hotel', 'Guide', 'Overcharging', 'Misbehavior', 'Safety', 'Other'
    ];

    const getExpectedDigits = () => {
        const country = countryCodes.find(c => c.code === formData.countryCode);
        return country ? country.digits : 10;
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'fullName':
                return value.trim().length < 2 ? 'Full name must be at least 2 characters' : '';
            case 'mobile':
                {
                    const expectedDigits = getExpectedDigits();
                    const digitsOnly = value.replace(/\D/g, '');
                    if (!digitsOnly) return 'Mobile number is required';
                    if (digitsOnly.length !== expectedDigits) {
                        return `Mobile number must be exactly ${expectedDigits} digits for ${formData.countryCode}`;
                    }
                    if (formData.countryCode === '+91' && !/^[6-9]/.test(digitsOnly)) {
                        return 'Indian mobile number must start with 6, 7, 8, or 9';
                    }
                    return '';
                }
            case 'email':
                return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Enter a valid email address' : '';
            case 'country':
                return formData.nationality === 'international' && !value ? 'Country is required' : '';
            case 'state':
                return formData.nationality === 'domestic' && !value ? 'State is required' : '';
            case 'complaintType':
                return !value ? 'Please select complaint type' : '';
            case 'location':
                return !value ? 'Please select location' : '';
            case 'incidentDate':
                return !value ? 'Please select incident date' : '';
            case 'description':
                return value.trim().length < 30 ? 'Description must be at least 30 characters' : '';
            case 'consent':
                return !value ? 'You must confirm the information is correct' : '';
            default:
                return '';
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        if (errors[name]) {
            const newErrors = { ...errors };
            const error = validateField(name, newValue);
            if (error) {
                newErrors[name] = error;
            } else {
                delete newErrors[name];
            }
            setErrors(newErrors);
            setShowErrorSummary(Object.keys(newErrors).length > 0);
        }
    };

    const handleNationalityChange = (e) => {
        const nationality = e.target.value;
        setFormData(prev => ({
            ...prev,
            nationality,
            countryCode: nationality === 'domestic' ? '+91' : prev.countryCode,
            country: nationality === 'domestic' ? '' : prev.country,
            state: nationality === 'international' ? '' : prev.state
        }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            const maxSize = 5 * 1024 * 1024;

            if (!validTypes.includes(file.type)) {
                alert('Please upload only JPG, PNG, or PDF files');
                return;
            }
            if (file.size > maxSize) {
                alert('File size must be less than 5MB');
                return;
            }
            setUploadedFile(file);
        }
    };

    const removeFile = () => {
        setUploadedFile(null);
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        setErrors(newErrors);
        setShowErrorSummary(Object.keys(newErrors).length > 0);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);

        setTimeout(() => {
            const generatedId = 'RJTC' + Date.now().toString().slice(-8);
            const timestamp = new Date();

            setComplaintId(generatedId);
            setSubmittedData({
                ...formData,
                complaintId: generatedId,
                submittedAt: timestamp.toLocaleString('en-IN', {
                    dateStyle: 'long',
                    timeStyle: 'short'
                }),
                fileName: uploadedFile ? uploadedFile.name : null
            });
            setIsSubmitting(false);
            setCurrentPage('success');
        }, 2000);
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            nationality: 'domestic',
            country: '',
            countryCode: '+91',
            state: '',
            mobile: '',
            email: '',
            complaintType: '',
            location: '',
            incidentDate: '',
            description: '',
            consent: false
        });
        setErrors({});
        setUploadedFile(null);
        setShowErrorSummary(false);
        setCurrentPage('form');
    };

    const viewDetails = () => {
        setCurrentPage('details');
    };

    const isFormValid = () => {
        const expectedDigits = getExpectedDigits();
        const mobileDigits = formData.mobile.replace(/\D/g, '');

        return formData.fullName.trim().length >= 2 &&
            mobileDigits.length === expectedDigits &&
            (formData.countryCode !== '+91' || /^[6-9]/.test(mobileDigits)) &&
            formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
            (formData.nationality === 'domestic' ? formData.state : formData.country) &&
            formData.complaintType &&
            formData.location &&
            formData.incidentDate &&
            formData.description.trim().length >= 30 &&
            formData.consent;
    };

    // Complaint Details Page
    if (currentPage === 'details') {
        return (
            <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-indigo-100 text-white">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
                    <div className="container mx-auto px-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-center">
                            Complaint Details
                        </h1>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-200">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                    Complaint Summary
                                </h2>
                                <p className="text-gray-600">
                                    Submitted on {submittedData.submittedAt}
                                </p>
                            </div>
                            <div className="bg-indigo-100 px-6 py-3 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">Complaint ID</p>
                                <p className="text-xl font-bold text-indigo-600">{submittedData.complaintId}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <BiUser className="w-5 h-5 text-indigo-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Full Name</p>
                                            <p className="text-lg font-semibold text-gray-900">{submittedData.fullName}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <BiGlobe className="w-5 h-5 text-indigo-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Nationality</p>
                                            <p className="text-lg font-semibold text-gray-900 capitalize">
                                                {submittedData.nationality}
                                                {submittedData.nationality === 'domestic' ? ` - ${submittedData.state}` : ` - ${submittedData.country}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <BiPhone className="w-5 h-5 text-indigo-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Contact Number</p>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {submittedData.countryCode} {submittedData.mobile}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <CiMail className="w-5 h-5 text-indigo-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Email Address</p>
                                            <p className="text-lg font-semibold text-gray-900 break-all">{submittedData.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <FiAlertCircle className="w-5 h-5 text-indigo-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Complaint Type</p>
                                            <p className="text-lg font-semibold text-gray-900">{submittedData.complaintType}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <BiMapPin className="w-5 h-5 text-indigo-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Location</p>
                                            <p className="text-lg font-semibold text-gray-900">{submittedData.location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-5 md:col-span-2">
                                    <div className="flex items-start gap-3">
                                        <BiCalendar className="w-5 h-5 text-indigo-600 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Date of Incident</p>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {new Date(submittedData.incidentDate).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-50 rounded-xl p-6">
                                <h3 className="font-bold text-gray-900 mb-3 text-lg">Description of Complaint</h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{submittedData.description}</p>
                            </div>

                            {submittedData.fileName && (
                                <div className="bg-blue-50 rounded-xl p-5">
                                    <div className="flex items-center gap-3">
                                        <FiFileText className="w-6 h-6 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Attached Evidence</p>
                                            <p className="text-lg font-semibold text-gray-900">{submittedData.fileName}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t-2 border-gray-200">
                            <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
                                <div className="flex items-start gap-3">
                                    <BiCheck className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-green-900 mb-1">What Happens Next?</h4>
                                        <ul className="text-sm text-green-800 space-y-1">
                                            <li>• Your complaint will be reviewed within 48 hours</li>
                                            <li>• You will receive updates via email and SMS</li>
                                            <li>• The concerned department will contact you if needed</li>
                                            <li>• Keep your Complaint ID for future reference</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">
                                <button
                                    onClick={resetForm}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <BsFileCheck className="w-5 h-5" />
                                    Submit Another Complaint
                                </button>

                                <button
                                    onClick={() => window.print()}
                                    className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <BsFileText className="w-5 h-5" />
                                    Print This Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Success Page
    if (currentPage === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
                <div className="container mx-auto px-4 py-8 max-w-2xl">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BiCheck className="w-12 h-12 text-green-600" />
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Submission Successful!
                        </h1>

                        <p className="text-lg text-gray-600 mb-8">
                            Your complaint has been successfully submitted to Rajasthan Tourism.
                        </p>

                        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-6 mb-8">
                            <p className="text-sm text-gray-600 mb-2">Your Complaint ID</p>
                            <p className="text-2xl md:text-3xl font-bold text-indigo-600 tracking-wider">
                                {complaintId}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Please save this ID for future reference
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={viewDetails}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                <FiFileText className="w-5 h-5" />
                                View Complaint Details
                            </button>

                            <button
                                onClick={resetForm}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                <BsFileCheck className="w-5 h-5" />
                                Submit Another Complaint
                            </button>

                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                <BiHome className="w-5 h-5" />
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Form Page
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
            <div className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white py-6 shadow-lg">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-center">
                        Rajasthan Tourism Complaint Portal
                    </h1>
                    <p className="text-center text-indigo-100 mt-2 text-sm md:text-base">
                        Department of Tourism, Government of Rajasthan
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
                    <div className="mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Lodge Your Complaint
                        </h2>
                        <p className="text-gray-600">
                            Please provide accurate information to help us address your concern
                        </p>
                    </div>

                    <div className="space-y-6">
                        {showErrorSummary && Object.keys(errors).length > 0 && (
                            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 animate-pulse">
                                <div className="flex items-start gap-3">
                                    <FiAlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-red-900 text-lg mb-2">
                                            Please fix the following errors:
                                        </h3>
                                        <ul className="space-y-1">
                                            {Object.entries(errors).map(([field, error]) => (
                                                <li key={field} className="text-red-700 text-sm flex items-start gap-2">
                                                    <span className="text-red-500 font-bold">•</span>
                                                    <span>
                                                        <strong className="font-semibold capitalize">
                                                            {field.replace(/([A-Z])/g, ' $1').trim()}:
                                                        </strong> {error}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <FiAlertCircle className="w-4 h-4" />
                                    {errors.fullName}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Nationality <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="nationality"
                                        value="domestic"
                                        checked={formData.nationality === 'domestic'}
                                        onChange={handleNationalityChange}
                                        className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-gray-700 font-medium">Domestic</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="nationality"
                                        value="international"
                                        checked={formData.nationality === 'international'}
                                        onChange={handleNationalityChange}
                                        className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-gray-700 font-medium">International</span>
                                </label>
                            </div>
                        </div>

                        {formData.nationality === 'international' && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Country <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    placeholder="Enter your country"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                                />
                                {errors.country && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <FiAlertCircle className="w-4 h-4" />
                                        {errors.country}
                                    </p>
                                )}
                            </div>
                        )}

                        {formData.nationality === 'domestic' && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Indian State <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-white"
                                >
                                    <option value="">Select your state</option>
                                    {indianStates.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                                {errors.state && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <FiAlertCircle className="w-4 h-4" />
                                        {errors.state}
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-3">
                                <select
                                    name="countryCode"
                                    value={formData.countryCode}
                                    onChange={handleInputChange}
                                    disabled={formData.nationality === 'domestic'}
                                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    {countryCodes.map(({ code, country }) => (
                                        <option key={code} value={code}>{code} {country}</option>
                                    ))}
                                </select>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                    placeholder={`${getExpectedDigits()}-digit mobile number`}
                                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Expected digits: {getExpectedDigits()} for {formData.countryCode}
                            </p>
                            {errors.mobile && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <FiAlertCircle className="w-4 h-4" />
                                    {errors.mobile}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="your.email@example.com"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <FiAlertCircle className="w-4 h-4" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Type of Complaint <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="complaintType"
                                    value={formData.complaintType}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-white"
                                >
                                    <option value="">Select complaint type</option>
                                    {complaintTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                {errors.complaintType && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <FiAlertCircle className="w-4 h-4" />
                                        {errors.complaintType}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Location of Incident <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-white"
                                >
                                    <option value="">Select city/location</option>
                                    {rajasthanCities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                                {errors.location && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <FiAlertCircle className="w-4 h-4" />
                                        {errors.location}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Date of Incident <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="incidentDate"
                                value={formData.incidentDate}
                                onChange={handleInputChange}
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                            />
                            {errors.incidentDate && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <FiAlertCircle className="w-4 h-4" />
                                    {errors.incidentDate}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description of Complaint <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Please describe your complaint in detail (minimum 30 characters)"
                                rows="5"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                            />
                            <div className="flex justify-between items-center mt-1">
                                {errors.description ? (
                                    <p className="text-red-500 text-sm flex items-center gap-1">
                                        <FiAlertCircle className="w-4 h-4" />
                                        {errors.description}
                                    </p>
                                ) : (
                                    <span className="text-sm text-gray-500">
                                        {formData.description.length} / 30 minimum characters
                                    </span>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Upload Evidence (Optional)
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors">
                                {uploadedFile ? (
                                    <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FiFileText className="w-6 h-6 text-indigo-600" />
                                            <div className="text-left">
                                                <p className="font-medium text-gray-900 text-sm">{uploadedFile.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {(uploadedFile.size / 1024).toFixed(2)} KB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <BiX className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer">
                                        <BiUpload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-600 font-medium mb-1">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            JPG, PNG or PDF (Max 5MB)
                                        </p>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg,application/pdf"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="consent"
                                    checked={formData.consent}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 mt-0.5 flex-shrink-0"
                                />
                                <span className="text-sm text-gray-700">
                                    I confirm that the information provided above is correct to the best of my knowledge.
                                    I understand that providing false information may result in legal action.
                                    <span className="text-red-500"> *</span>
                                </span>
                            </label>
                            {errors.consent && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1 ml-8">
                                    <FiAlertCircle className="w-4 h-4" />
                                    {errors.consent}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!isFormValid() || isSubmitting}
                            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${isFormValid() && !isSubmitting
                                ? 'bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Submitting...
                                </span>
                            ) : (
                                'Submit Complaint'
                            )}
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-gray-600">
                    <p>For urgent assistance, contact: <span className="font-semibold">1800-180-6030</span></p>
                    <p className="mt-1">Email: <span className="font-semibold">support@rajasthantourism.gov.in</span></p>
                </div>
            </div>
        </div>
    );
};

export default TouristServicesPage;
