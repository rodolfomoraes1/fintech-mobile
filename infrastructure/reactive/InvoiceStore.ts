import { BehaviorSubject, Observable } from "rxjs";
import { Invoice } from "../../domain/entities/Invoice";

class InvoiceStore {
  private invoicesSubject = new BehaviorSubject<Invoice[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  get invoices$(): Observable<Invoice[]> {
    return this.invoicesSubject.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  setInvoices(invoices: Invoice[]) {
    this.invoicesSubject.next(invoices);
  }

  addInvoice(invoice: Invoice) {
    const current = this.invoicesSubject.value;
    this.invoicesSubject.next([invoice, ...current]);
  }

  removeInvoice(invoiceId: string) {
    const current = this.invoicesSubject.value;
    this.invoicesSubject.next(current.filter((inv) => inv.id !== invoiceId));
  }

  setLoading(loading: boolean) {
    this.loadingSubject.next(loading);
  }

  clear() {
    this.invoicesSubject.next([]);
  }
}

export const invoiceStore = new InvoiceStore();
