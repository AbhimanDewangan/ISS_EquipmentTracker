import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Package, Users, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const SportsEquipmentTracker = () => {
  const [equipment, setEquipment] = useState([
    { id: 1, name: 'Football', category: 'Ball Sports', quantity: 15, available: 12, condition: 'Good', location: 'Main Store', lastChecked: '2024-10-10' },
    { id: 2, name: 'Basketball', category: 'Ball Sports', quantity: 10, available: 8, condition: 'Good', location: 'Main Store', lastChecked: '2024-10-10' },
    { id: 3, name: 'Cricket Bat', category: 'Cricket', quantity: 20, available: 18, condition: 'Fair', location: 'Cricket Room', lastChecked: '2024-10-09' },
    { id: 4, name: 'Tennis Racket', category: 'Racket Sports', quantity: 12, available: 10, condition: 'Good', location: 'Court Store', lastChecked: '2024-10-08' },
    { id: 5, name: 'Volleyball', category: 'Ball Sports', quantity: 8, available: 6, condition: 'Excellent', location: 'Main Store', lastChecked: '2024-10-10' },
  ]);

  const [borrowRecords, setBorrowRecords] = useState([
    { id: 1, equipmentId: 1, equipmentName: 'Football', studentName: 'Ahmed Al-Balushi', studentClass: 'Grade 10A', borrowDate: '2024-10-12', returnDate: null, status: 'borrowed' },
    { id: 2, equipmentId: 2, equipmentName: 'Basketball', studentName: 'Fatima Al-Lawati', studentClass: 'Grade 9B', borrowDate: '2024-10-11', returnDate: '2024-10-12', status: 'returned' },
    { id: 3, equipmentId: 3, equipmentName: 'Cricket Bat', studentName: 'Rashid Khan', studentClass: 'Grade 11C', borrowDate: '2024-10-10', returnDate: null, status: 'borrowed' },
  ]);

  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [newEquipment, setNewEquipment] = useState({
    name: '', category: '', quantity: 0, available: 0, condition: 'Good', location: '', lastChecked: new Date().toISOString().split('T')[0]
  });

  const [newBorrow, setNewBorrow] = useState({
    equipmentId: '', studentName: '', studentClass: '', borrowDate: new Date().toISOString().split('T')[0]
  });

  const categories = ['Ball Sports', 'Cricket', 'Racket Sports', 'Athletics', 'Swimming', 'Fitness', 'Other'];
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor', 'Needs Repair'];
  const locations = ['Main Store', 'Cricket Room', 'Court Store', 'Swimming Pool', 'Gym', 'Athletics Track'];

  const handleAddEquipment = () => {
    if (!newEquipment.name || !newEquipment.category) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingItem) {
      setEquipment(equipment.map(item => 
        item.id === editingItem.id 
          ? { ...newEquipment, id: item.id, available: newEquipment.quantity - (item.quantity - item.available) }
          : item
      ));
      setEditingItem(null);
    } else {
      const newItem = {
        ...newEquipment,
        id: Date.now(),
        available: newEquipment.quantity
      };
      setEquipment([...equipment, newItem]);
    }

    setNewEquipment({ name: '', category: '', quantity: 0, available: 0, condition: 'Good', location: '', lastChecked: new Date().toISOString().split('T')[0] });
    setShowAddModal(false);
  };

  const handleBorrow = () => {
    if (!newBorrow.equipmentId || !newBorrow.studentName || !newBorrow.studentClass) {
      alert('Please fill in all fields');
      return;
    }

    const selectedEquipment = equipment.find(e => e.id === parseInt(newBorrow.equipmentId));
    
    if (!selectedEquipment || selectedEquipment.available < 1) {
      alert('Equipment not available');
      return;
    }

    const borrowRecord = {
      id: Date.now(),
      equipmentId: selectedEquipment.id,
      equipmentName: selectedEquipment.name,
      ...newBorrow,
      returnDate: null,
      status: 'borrowed'
    };

    setBorrowRecords([...borrowRecords, borrowRecord]);
    setEquipment(equipment.map(e => 
      e.id === selectedEquipment.id 
        ? { ...e, available: e.available - 1 }
        : e
    ));

    setNewBorrow({ equipmentId: '', studentName: '', studentClass: '', borrowDate: new Date().toISOString().split('T')[0] });
    setShowBorrowModal(false);
  };

  const handleReturn = (recordId) => {
    const record = borrowRecords.find(r => r.id === recordId);
    if (!record) return;

    setBorrowRecords(borrowRecords.map(r => 
      r.id === recordId 
        ? { ...r, returnDate: new Date().toISOString().split('T')[0], status: 'returned' }
        : r
    ));

    setEquipment(equipment.map(e => 
      e.id === record.equipmentId 
        ? { ...e, available: e.available + 1 }
        : e
    ));
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setEquipment(equipment.filter(item => item.id !== id));
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewEquipment(item);
    setShowAddModal(true);
  };

  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBorrowRecords = borrowRecords.filter(record =>
    record.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.studentClass.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeRecords = borrowRecords.filter(r => r.status === 'borrowed').length;
  const totalItems = equipment.reduce((sum, item) => sum + item.quantity, 0);
  const availableItems = equipment.reduce((sum, item) => sum + item.available, 0);
  const lowStockItems = equipment.filter(item => item.available < 3).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Indian School Sohar</h1>
              <p className="text-blue-100 mt-1">Sports Equipment Management System</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Academic Year 2024-25</p>
              <p className="text-xs text-blue-200 mt-1">{new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Items</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{totalItems}</p>
              </div>
              <Package className="text-blue-500" size={40} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Available</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{availableItems}</p>
              </div>
              <CheckCircle className="text-green-500" size={40} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Currently Borrowed</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{activeRecords}</p>
              </div>
              <Clock className="text-orange-500" size={40} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Low Stock Alert</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{lowStockItems}</p>
              </div>
              <AlertCircle className="text-red-500" size={40} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'inventory' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Equipment Inventory
            </button>
            <button
              onClick={() => setActiveTab('borrow')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'borrow' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Borrow Records
            </button>
          </div>

          {/* Search and Actions */}
          <div className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-b bg-gray-50">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search equipment, students, or classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              {activeTab === 'inventory' && (
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setNewEquipment({ name: '', category: '', quantity: 0, available: 0, condition: 'Good', location: '', lastChecked: new Date().toISOString().split('T')[0] });
                    setShowAddModal(true);
                  }}
                  className="flex-1 sm:flex-initial flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  <Plus size={20} />
                  Add Equipment
                </button>
              )}
              {activeTab === 'borrow' && (
                <button
                  onClick={() => setShowBorrowModal(true)}
                  className="flex-1 sm:flex-initial flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  <Users size={20} />
                  Issue Equipment
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {activeTab === 'inventory' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-left">
                      <th className="pb-3 font-semibold text-gray-700">Equipment</th>
                      <th className="pb-3 font-semibold text-gray-700">Category</th>
                      <th className="pb-3 font-semibold text-gray-700">Quantity</th>
                      <th className="pb-3 font-semibold text-gray-700">Available</th>
                      <th className="pb-3 font-semibold text-gray-700">Condition</th>
                      <th className="pb-3 font-semibold text-gray-700">Location</th>
                      <th className="pb-3 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEquipment.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 font-medium text-gray-800">{item.name}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-4 text-gray-700">{item.quantity}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.available < 3 ? 'bg-red-100 text-red-800' : 
                            item.available < 5 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.available}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                            item.condition === 'Good' ? 'bg-blue-100 text-blue-800' :
                            item.condition === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.condition}
                          </span>
                        </td>
                        <td className="py-4 text-gray-700">{item.location}</td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'borrow' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-left">
                      <th className="pb-3 font-semibold text-gray-700">Equipment</th>
                      <th className="pb-3 font-semibold text-gray-700">Student Name</th>
                      <th className="pb-3 font-semibold text-gray-700">Class</th>
                      <th className="pb-3 font-semibold text-gray-700">Borrow Date</th>
                      <th className="pb-3 font-semibold text-gray-700">Return Date</th>
                      <th className="pb-3 font-semibold text-gray-700">Status</th>
                      <th className="pb-3 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBorrowRecords.map((record) => (
                      <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 font-medium text-gray-800">{record.equipmentName}</td>
                        <td className="py-4 text-gray-700">{record.studentName}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                            {record.studentClass}
                          </span>
                        </td>
                        <td className="py-4 text-gray-700">{new Date(record.borrowDate).toLocaleDateString('en-IN')}</td>
                        <td className="py-4 text-gray-700">
                          {record.returnDate ? new Date(record.returnDate).toLocaleDateString('en-IN') : '-'}
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            record.status === 'borrowed' 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {record.status === 'borrowed' ? 'Out' : 'Returned'}
                          </span>
                        </td>
                        <td className="py-4">
                          {record.status === 'borrowed' && (
                            <button
                              onClick={() => handleReturn(record.id)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                            >
                              Mark Returned
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Equipment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {editingItem ? 'Edit Equipment' : 'Add New Equipment'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Name *</label>
                <input
                  type="text"
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., Football"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={newEquipment.category}
                  onChange={(e) => setNewEquipment({...newEquipment, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={newEquipment.quantity}
                  onChange={(e) => setNewEquipment({...newEquipment, quantity: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select
                  value={newEquipment.condition}
                  onChange={(e) => setNewEquipment({...newEquipment, condition: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {conditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  value={newEquipment.location}
                  onChange={(e) => setNewEquipment({...newEquipment, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select Location</option>
                  {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEquipment}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                {editingItem ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Borrow Modal */}
      {showBorrowModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Issue Equipment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Equipment *</label>
                <select
                  value={newBorrow.equipmentId}
                  onChange={(e) => setNewBorrow({...newBorrow, equipmentId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Choose equipment</option>
                  {equipment.filter(e => e.available > 0).map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} (Available: {item.available})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                <input
                  type="text"
                  value={newBorrow.studentName}
                  onChange={(e) => setNewBorrow({...newBorrow, studentName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                <input
                  type="text"
                  value={newBorrow.studentClass}
                  onChange={(e) => setNewBorrow({...newBorrow, studentClass: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., Grade 10A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Borrow Date</label>
                <input
                  type="date"
                  value={newBorrow.borrowDate}
                  onChange={(e) => setNewBorrow({...newBorrow, borrowDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBorrowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBorrow}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportsEquipmentTracker;
