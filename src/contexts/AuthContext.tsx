
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  department?: string;
  phone?: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Admin default credentials
    if (email === 'admin@gmail.com' && password === 'password') {
      const adminUser: User = {
        id: 'admin-1',
        name: 'Administrator',
        email: 'admin@gmail.com',
        role: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      return true;
    }

    // Check registered users
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const signup = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Check if user already exists
      if (users.find((u: any) => u.email === userData.email)) {
        return false;
      }

      const newUser = {
        ...userData,
        id: Date.now().toString()
      };

      users.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      return true;
    } catch {
      return false;
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update in registered users list
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData };
        localStorage.setItem('registeredUsers', JSON.stringify(users));
      }
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;

    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    
    if (userIndex !== -1 && users[userIndex].password === currentPassword) {
      users[userIndex].password = newPassword;
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      return true;
    }
    
    return false;
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userExists = users.find((u: any) => u.email === email);
    
    if (userExists) {
      // In a real app, this would send an email
      console.log(`Password reset email would be sent to ${email}`);
      return true;
    }
    
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      signup,
      updateProfile,
      changePassword,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
