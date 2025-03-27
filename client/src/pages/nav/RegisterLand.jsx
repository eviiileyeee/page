import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Landmark, 
  MapPin, 
  Ruler, 
  DollarSign, 
  FileText, 
  Upload, 
  AlertCircle, 
  CheckCircle2,
  Building2,
  ArrowLeft,
  Shield
} from 'lucide-react';

const RegisterLand = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    landTitle: '',
    landType: '',
    area: '',
    location: '',
    description: '',
    price: '',
    documents: [],
    existingRecordId: '',
    claimType: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const landTypes = [
    'residential',
    'commercial',
    'agricultural',
    'industrial'
  ];

  const claimTypes = [
    'ownership',
    'transfer',
    'update'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      documents: Array.from(e.target.files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      console.log('Starting form submission');
      console.log('Form data:', formData);

      // Validate required fields
      if (!formData.landTitle || !formData.landType || !formData.area || 
          !formData.location || !formData.price || !formData.claimType || 
          !formData.existingRecordId || !formData.documents.length) {
        const missingFields = Object.entries(formData)
          .filter(([key, value]) => !value || (Array.isArray(value) && !value.length))
          .map(([key]) => key);
        console.error('Missing required fields:', missingFields);
        setError('Please fill in all required fields and upload at least one document');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setError('Please login to register land');
        return;
      }
      console.log('Token found');

      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'documents') {
          console.log('Processing documents:', formData.documents);
          formData.documents.forEach((doc, index) => {
            console.log(`Adding document ${index + 1}:`, doc.name);
            submitData.append('documents', doc);
          });
        } else {
          console.log(`Adding field ${key}:`, formData[key]);
          submitData.append(key, formData[key]);
        }
      });

      console.log('Sending request to server...');
      const response = await fetch('http://localhost:8001/api/land/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData,
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        console.error('Server error:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        throw new Error(data.message || 'Failed to register land');
      }

      console.log('Land registration successful');
      setSuccess('Land registered successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Form submission error:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      setError(err.message || 'An error occurred while registering the land');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Landmark className="w-16 h-16 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Register New Land</h1>
          <p className="text-lg text-gray-600">Fill in the details to register your land property</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <p className="text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-700 font-medium">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span>Land Title *</span>
                </label>
                <input
                  type="text"
                  name="landTitle"
                  value={formData.landTitle}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter land title"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-700 font-medium">
                  <Building2 className="w-5 h-5 text-blue-500" />
                  <span>Land Type *</span>
                </label>
                <select
                  name="landType"
                  value={formData.landType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Land Type</option>
                  {landTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-700 font-medium">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span>Claim Type *</span>
                </label>
                <select
                  name="claimType"
                  value={formData.claimType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Claim Type</option>
                  {claimTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-700 font-medium">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span>Existing Record ID *</span>
                </label>
                <input
                  type="text"
                  name="existingRecordId"
                  value={formData.existingRecordId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter existing record ID"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-700 font-medium">
                  <Ruler className="w-5 h-5 text-blue-500" />
                  <span>Area (sq ft) *</span>
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter area"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-700 font-medium">
                  <DollarSign className="w-5 h-5 text-blue-500" />
                  <span>Price *</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter price"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-gray-700 font-medium">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span>Location *</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter location"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-gray-700 font-medium">
                <FileText className="w-5 h-5 text-blue-500" />
                <span>Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter land description"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-gray-700 font-medium">
                <Upload className="w-5 h-5 text-blue-500" />
                <span>Documents * (Max 5 files)</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="file-upload"
                  required
                  multiple
                  max="5"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Drag and drop your documents here</p>
                  <p className="text-sm text-gray-500 mt-2">or click to browse</p>
                </label>
              </div>
              {formData.documents.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Selected files:</p>
                  {formData.documents.map((doc, index) => (
                    <p key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>{doc.name}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Register Land</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterLand;
