// src/utils/date.ts
export const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN"); // dd/mm/yyyy
};
