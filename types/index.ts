export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserBalance {
  id: string;
  current_balance: number;
  date: string;
}

export type InvoiceType = "pagamento" | "transferencia" | "deposito";

export interface PersonalInvoice {
  id: string;
  receiver_name: string;
  amount: number;
  date: string;
  type: InvoiceType;
  user_id: string;
  receipt_url?: string;
  created_at: string;
  updated_at: string;
}

export type CreateInvoiceData = Omit<
  PersonalInvoice,
  "id" | "created_at" | "updated_at"
> & {
  created_at?: string;
  updated_at?: string;
};

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signUp: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signOut: (router?: any) => Promise<{ error: string | null }>;
}
