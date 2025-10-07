export class AuthErrorService {
  static getErrorMessage(error: any): string {
    const errorCode = error?.code;
    const errorMessage = error?.message;

    switch (errorCode) {
      case "auth/email-already-in-use":
        return "Este e-mail já está em uso. Tente fazer login ou use outro e-mail.";

      case "auth/weak-password":
        return "A senha é muito fraca. Use pelo menos 6 caracteres.";

      case "auth/invalid-email":
        return "Por favor, digite um e-mail válido.";

      case "auth/user-not-found":
        return "Usuário não encontrado. Verifique o e-mail ou cadastre-se.";

      case "auth/wrong-password":
        return "Senha incorreta. Tente novamente.";

      case "auth/network-request-failed":
        return "Erro de conexão. Verifique sua internet e tente novamente.";

      case "auth/too-many-requests":
        return "Muitas tentativas. Tente novamente mais tarde.";

      case "auth/invalid-credential":
        return "Credenciais inválidas. Tente novamente.";

      default:
        return errorMessage || "Ocorreu um erro inesperado. Tente novamente.";
    }
  }
}
