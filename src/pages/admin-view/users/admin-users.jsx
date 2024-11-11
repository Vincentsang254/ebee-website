import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MdEdit, MdDelete, MdClose } from "react-icons/md"; // Edit and Delete icons
import { Skeleton } from "@/components/ui/skeleton"; // Skeleton for loading state

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Mock data for users (replace with actual data fetching logic)
  useEffect(() => {
    setUsers([
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
      { id: 3, name: 'Michael Johnson', email: 'michael@example.com', role: 'User' },
      { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'Admin' }
    ]);
  }, []);

  const handleEditUser = (user) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
  };

  if (!users.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8 text-center">Manage Users</h1>
        
        {/* Shadcn Skeleton Loader */}
        <Skeleton className="w-full h-72 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-center">Manage Users</h1>

      {/* Dialog for Edit User */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogContent className="w-96 p-6 overflow-y-auto">
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle>Edit User</DialogTitle>
            <MdClose
              className="text-gray-600 cursor-pointer"
              onClick={handleCloseDialog}
            />
          </DialogHeader>
          <form>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full border rounded-md"
                  placeholder="User Name"
                  defaultValue={editingUser?.name}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full border rounded-md"
                  placeholder="User Email"
                  defaultValue={editingUser?.email}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Role</label>
                <input
                  type="text"
                  className="mt-1 block w-full border rounded-md"
                  placeholder="User Role"
                  defaultValue={editingUser?.role}
                />
              </div>
            </div>
            <DialogFooter className="mt-6 flex justify-end">
              <Button type="button" variant="secondary" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Table to Display Users */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <MdEdit
                    className="text-blue-600 cursor-pointer"
                    onClick={() => handleEditUser(user)}
                  />
                  <MdDelete
                    className="text-red-600 cursor-pointer"
                    onClick={() => handleDeleteUser(user.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminUsers;
