export class InputValidator {
  static validateEmail(email: string): { valid: boolean; error?: string } {
    const trimmed = email.trim();

    if (!trimmed) {
      return { valid: false, error: "Email é obrigatório" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return { valid: false, error: "Email inválido" };
    }

    if (/<|>|'|"|;/.test(trimmed)) {
      return { valid: false, error: "Email contém caracteres inválidos" };
    }

    return { valid: true };
  }

  static validatePassword(password: string): {
    valid: boolean;
    error?: string;
  } {
    if (!password) {
      return { valid: false, error: "Senha é obrigatória" };
    }

    if (password.length < 6) {
      return { valid: false, error: "Senha deve ter no mínimo 6 caracteres" };
    }

    return { valid: true };
  }

  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/<script[^>]*>.*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, "")
      .replace(/['";]/g, "");
  }

  static validateAmount(amount: number): { valid: boolean; error?: string } {
    if (isNaN(amount) || amount < 0) {
      return { valid: false, error: "Valor inválido" };
    }

    if (amount === 0) {
      return { valid: false, error: "Valor deve ser maior que zero" };
    }

    if (amount > 999999999) {
      return { valid: false, error: "Valor muito alto" };
    }

    return { valid: true };
  }

  static validateName(name: string): { valid: boolean; error?: string } {
    const trimmed = name.trim();

    if (!trimmed) {
      return { valid: false, error: "Nome é obrigatório" };
    }

    if (trimmed.length < 2) {
      return { valid: false, error: "Nome muito curto" };
    }

    if (trimmed.length > 100) {
      return { valid: false, error: "Nome muito longo" };
    }

    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmed)) {
      return { valid: false, error: "Nome contém caracteres inválidos" };
    }

    return { valid: true };
  }
}
