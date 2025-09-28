export type User = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'agent' | 'client';
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
  token: string;
}

export type Identite = {
    email: string;
    password: string;
}

export const ANONYMOUS_USER: User = <User>{
    id: 0,
    nom: '',
    prenom: '',
    email: '',
    role: 'client',
    token: ''
}

export type GetUserResponse = {
  success: boolean;
  data: {
    user: User;
  };
  message: string;
}
