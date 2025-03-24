

export default function cleanFileName (fileName: string) {
      return fileName
          .normalize("NFD") // Remove accents (e.g., á → a)
          .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
          .replace(/\s+/g, "-") // Replace spaces with underscores
          .replace(/[^\w.-]/g, "") // Remove special characters except _ . -
          .toLowerCase();
};