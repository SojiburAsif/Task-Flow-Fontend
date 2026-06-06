export type SearchResultItem = {
	id: string;
	type: "project" | "task" | "site";
	title: string;
	subtitle?: string | null;
	status?: string | null;
	link: string;
	target?: "_self" | "_blank";
};
