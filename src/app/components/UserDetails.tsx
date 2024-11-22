"use client";

export type UserDetailsType = {
  uid: string;
  name?: string;
  email: string;
  nickname?: string;
  age?: number;
  dob?: string;
  sex?: string;
  role?: "Student" | "Teacher";
};

class UserDetailsClass {
  private static instance: UserDetailsClass;
  private userDetails: UserDetailsType | null = null;

  private constructor() {
    // Initialize from localStorage only if in browser environment
    if (typeof window !== 'undefined') {
      const savedDetails = localStorage.getItem('userDetails');
      if (savedDetails) {
        try {
          this.userDetails = JSON.parse(savedDetails);
        } catch (error) {
          console.error('Error parsing user details from localStorage:', error);
          this.userDetails = null;
        }
      }
    }
  }

  static getInstance(): UserDetailsClass {
    if (!UserDetailsClass.instance) {
      UserDetailsClass.instance = new UserDetailsClass();
    }
    return UserDetailsClass.instance;
  }

  setUserDetails(details: UserDetailsType | null): void {
    this.userDetails = details;
    // Save to localStorage only in browser environment
    if (typeof window !== 'undefined') {
      try {
        if (details) {
          localStorage.setItem('userDetails', JSON.stringify(details));
        } else {
          localStorage.removeItem('userDetails');
        }
      } catch (error) {
        console.error('Error saving user details to localStorage:', error);
      }
    }
  }

  getUserDetails(): UserDetailsType | null {
    // Check localStorage only in browser environment
    if (typeof window !== 'undefined') {
      try {
        const savedDetails = localStorage.getItem('userDetails');
        if (savedDetails) {
          this.userDetails = JSON.parse(savedDetails);
        }
      } catch (error) {
        console.error('Error getting user details from localStorage:', error);
      }
    }
    return this.userDetails;
  }

  clearUserDetails(): void {
    this.userDetails = null;
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('userDetails');
      } catch (error) {
        console.error('Error clearing user details from localStorage:', error);
      }
    }
  }
}

// Create instance outside of class definition
const UserDetails = UserDetailsClass.getInstance();

export default UserDetails;