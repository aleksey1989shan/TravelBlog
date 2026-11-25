export const formattedDate = (commentDate: string): string => {
  return commentDate.slice(0, 10).replace(/-/g, ".");
};
