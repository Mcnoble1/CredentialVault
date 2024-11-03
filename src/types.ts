export interface Credential {
  id: string;
  title: string;
  institution: string;
  issueDate: string;
  hash: string;
  type: 'diploma' | 'certificate' | 'transcript';
  status: 'verified' | 'pending' | 'rejected';
}

export interface User {
  id: string;
  name: string;
  role: 'student' | 'institution' | 'verifier';
  email: string;
}