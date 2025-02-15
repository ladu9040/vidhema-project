
import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Save,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  SortAsc,
  User,
} from "lucide-react";
import userService from "../services/userService";
import UMHeader from "../components/UMHeader";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

function Main() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    dob: "",
    password: "",
    profileImage: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getUsers();
      setUsers(response);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewUser({ ...newUser, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (newUser.name && newUser.email && newUser.dob && newUser.password) {
      const formData = {
        name: newUser.name,
        email: newUser.email,
        dob: newUser.dob,
        password: newUser.password,
        profileImage: newUser.profileImage,
      };

      try {
        await userService.createUser(formData);
        await fetchUsers();
        setNewUser({
          name: "",
          email: "",
          dob: "",
          password: "",
          profileImage: null,
        });
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error creating user:", error);
        setError("Failed to create user");
      }
    }
  };

  const handleEdit = async (user) => {
    if (editingUser?.id === user.id) {
      try {
        await userService.updateUser(editingUser.id, editingUser);
        await fetchUsers();
        setEditingUser(null);
      } catch (error) {
        console.error("Error updating user:", error);
        setError("Failed to update user");
      }
    } else {
      setEditingUser({ ...user });
    }
  };

  const handleDelete = async (id) => {
    try {
      await userService.deleteUser(id);
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user");
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
    setIsSortMenuOpen(false);
  };

  const sortedUsers = [...users]
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.direction === "ascending") {
        return aValue.localeCompare(bValue);
      }
      return bValue.localeCompare(aValue);
    });

  return (
    <div>
      <UMHeader />
      <div className="container  mx-auto p-4">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 max-w-xs">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border rounded-lg"
              />
            </div>

            <div className="flex gap-4">
              {/* Sort Button */}
              <div className="relative">
                <button
                  onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
                >
                  <SortAsc className="mr-2" size={20} />
                  Sort by {sortConfig.key}
                  {sortConfig.direction === "ascending" ? (
                    <ChevronUp className="ml-2" size={20} />
                  ) : (
                    <ChevronDown className="ml-2" size={20} />
                  )}
                </button>

                {/* Sort Dropdown Menu */}
                {isSortMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border">
                    <button
                      onClick={() => handleSort("name")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg flex items-center"
                    >
                      Name
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "ascending" ? (
                          <ChevronUp className="ml-auto" size={20} />
                        ) : (
                          <ChevronDown className="ml-auto" size={20} />
                        ))}
                    </button>
                    <button
                      onClick={() => handleSort("email")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                    >
                      Email
                      {sortConfig.key === "email" &&
                        (sortConfig.direction === "ascending" ? (
                          <ChevronUp className="ml-auto" size={20} />
                        ) : (
                          <ChevronDown className="ml-auto" size={20} />
                        ))}
                    </button>
                    <button
                      onClick={() => handleSort("dob")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg flex items-center"
                    >
                      Date of Birth
                      {sortConfig.key === "dob" &&
                        (sortConfig.direction === "ascending" ? (
                          <ChevronUp className="ml-auto" size={20} />
                        ) : (
                          <ChevronDown className="ml-auto" size={20} />
                        ))}
                    </button>
                  </div>
                )}
              </div>

              {/* Add User Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
              >
                <Plus className="mr-2" size={20} />
                Add User
              </button>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {/* Add User Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Add New User</h2>

            <div>
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="w-full p-2 border rounded-lg mb-2"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full p-2 border rounded-lg mb-2"
              />
            </div>

            <div>
              <input
                type="date"
                placeholder="Date of Birth"
                value={newUser.dob}
                onChange={(e) =>
                  setNewUser({ ...newUser, dob: e.target.value })
                }
                className="w-full p-2 border rounded-lg mb-2"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="w-full p-2 border rounded-lg mb-2"
              />
            </div>

            <div>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full p-2 border rounded-lg mb-2"
              />
              {newUser.profileImage && (
                <img
                  src={newUser.profileImage}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-full"
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Add User
            </button>
          </form>
        </Modal>

        {/* User Cards Grid */}
        <div className="flex flex-col w-[100%]  gap-5  mt-[90px] ">
          {sortedUsers.map((user) => (
            <div key={user.id} className="bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {user.profile_image ? (
                    <img
                      src={`${user.profile_image}`}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <User size={24} className="text-gray-500" />
                    </div>
                  )}
                  {editingUser?.id === user.id ? (
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, name: e.target.value })
                      }
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-gray-600 hover:text-blue-500 cursor-pointer"
                  >
                    {editingUser?.id === user.id ? (
                      <Save size={20} />
                    ) : (
                      <Edit2 size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-gray-600 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {editingUser?.id === user.id ? (
                  <>
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        })
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                    <input
                      type="date"
                      value={editingUser.dob}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, dob: e.target.value })
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-gray-600"> DOB: {new Date(user.dob).toLocaleDateString()}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Main;
