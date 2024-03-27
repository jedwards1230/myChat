export const getHeaders = (userId: string) => ({
	Authorization: userId,
	"Content-Type": "application/json",
});
