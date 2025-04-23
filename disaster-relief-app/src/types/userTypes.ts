// filepath: d:\CURRENT PROJECTS\DRCP\disaster-relief-app\src\types\userTypes.ts
// filepath: d:\CURRENT PROJECTS\DRCP\disaster-relief-app\src\types\userTypes.ts
export interface UserState {
  user_id?: string;
  username?: string;
  email?: string;
  role?: string;
  phone_number?: string;
  location: { lat: number; lng: number } | null;
  created_at?: string;
  updated_at?: string;
  token: string | null;
  hasReported: boolean;
  hasBeenAccepted: boolean;
  hasBeenAssigned: boolean;
  previousReports: string[]; // Array of ObjectId references to Incident
  loading: boolean;
  error: string | null;
  workingOnReport: string | null; // ObjectId reference to Incident
}
