"use client";

import { useState, useEffect } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, DocumentData } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useRouter } from "next/navigation";
import UserDetails from "../components/UserDetails";
import { 
  User, 
  LogOut, 
  Save, 
  X, 
  Edit3,
  Shield,
  Mail,
  User2,
  GraduationCap,
  Phone,
  MapPin,
  Calendar
} from "lucide-react";

// Update the interface to match Firestore document structure
interface UserData extends DocumentData {
  name?: string;
  email?: string;
  role?: string;
  sex?: string;
  phone?: string;
  address?: string;
  birthday?: string;
  education?: string;
  uid?: string;
}

// Create a type for the update data
type UpdateData = {
  [K in keyof Omit<UserData, 'uid'>]?: UserData[K];
};

const FIELD_ICONS = {
  email: Mail,
  name: User2,
  role: Shield,
  sex: User,
  phone: Phone,
  address: MapPin,
  birthday: Calendar,
  education: GraduationCap
};

export default function AccountPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateData>({});
  const [error, setError] = useState("");
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserData;
            setUserData(data);
            setFormData(data);
            // @ts-expect-error
            UserDetails.setUserDetails({ ...data, email: user.email, uid: user.uid });
          } else {
            setError("User data not found. Redirecting...");
            router.push("/congrats");
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to load user data.");
        }
      } else {
        router.push("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setError("");
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Create an update object without the uid field
      const updateObject: UpdateData = { ...formData };
      delete updateObject.uid;

      await updateDoc(doc(db, "users", user.uid), updateObject);
      setUserData({ ...formData, uid: user.uid });
      UserDetails.setUserDetails({ ...formData, uid: user.uid });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component remains the same...

  const handleLogout = async () => {
    try {
      await signOut(auth);
      UserDetails.clearUserDetails();
      router.push("/");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };


  const renderField = (key: keyof UserData) => {
    // @ts-expect-error
    const FieldIcon = FIELD_ICONS[key] || User;

    if (key === "email" || key === "uid") {
      return (
        <div className="flex items-center space-x-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-4 py-3 text-blue-900 dark:text-blue-100">
          <FieldIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          <span>{formData[key]}</span>
        </div>
      );
    }

    if (key === "sex") {
      return (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FieldIcon className="h-5 w-5 text-gray-400" />
          </div>
          <select
            name={key}
            value={formData[key] || ""}
            onChange={handleInputChange}
            className="w-full pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      );
    }

    if (key === "role") {
      return (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FieldIcon className="h-5 w-5 text-gray-400" />
          </div>
          <select
            name={key}
            value={formData[key] || ""}
            onChange={handleInputChange}
            className="w-full pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            required
          >
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
          </select>
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FieldIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          name={key}
          value={formData[key] || ""}
          onChange={handleInputChange}
          className="w-full pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-100 p-4 rounded-lg max-w-md w-full">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 dark:bg-blue-500 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/10 rounded-full">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Account Details</h1>
              <p className="text-blue-100 text-sm">Manage your profile information</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {isEditing ? (
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData &&
                  Object.keys(formData).map((key) => (
                    <div key={key} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      {renderField(key as keyof UserData)}
                    </div>
                  ))}
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userData &&
                Object.entries(userData).map(([key, value]) => {
                  const FieldIcon = FIELD_ICONS[key as keyof typeof FIELD_ICONS] || User;
                  return (
                    <div key={key} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 mb-1">
                        <FieldIcon className="h-5 w-5" />
                        <span className="text-sm font-medium">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                      </div>
                      <p className="text-lg font-medium text-gray-900 dark:text-gray-100 pl-8">
                        {value || "Not set"}
                      </p>
                    </div>
                  );
                })}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-6 py-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}