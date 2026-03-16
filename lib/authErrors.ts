export function getFirebaseAuthErrorMessage(code: string) {
    switch (code) {
        case "auth/email-already-in-use":
            return "Un compte existe déjà avec cette adresse e-mail.";

        case "auth/invalid-email":
            return "L'adresse e-mail saisie est invalide.";

        case "auth/weak-password":
            return "Le mot de passe doit contenir au moins 6 caractères.";

        case "auth/invalid-credential":
            return "Email ou mot de passe incorrect.";

        case "auth/user-not-found":
            return "Aucun compte n'est associé à cette adresse e-mail.";

        case "auth/wrong-password":
            return "Mot de passe incorrect.";

        case "auth/missing-password":
            return "Veuillez saisir un mot de passe.";

        case "auth/too-many-requests":
            return "Trop de tentatives. Réessayez plus tard.";

        default:
            return "Une erreur est survenue. Veuillez réessayer.";
    }
}