import { BehaviorSubject, Observable } from "rxjs";

class BalanceStore {
  private balanceSubject = new BehaviorSubject<number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  get balance$(): Observable<number> {
    return this.balanceSubject.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  setBalance(balance: number) {
    this.balanceSubject.next(balance);
  }

  updateBalance(delta: number) {
    const current = this.balanceSubject.value;
    this.balanceSubject.next(current + delta);
  }

  setLoading(loading: boolean) {
    this.loadingSubject.next(loading);
  }

  clear() {
    this.balanceSubject.next(0);
  }
}

export const balanceStore = new BalanceStore();
