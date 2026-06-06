import { redirect } from "next/navigation";

type Props = {
	params: Promise<{ id: string }>;
	searchParams?: Promise<{ returnTo?: string | string[] }>;
};

export default async function TaskDetailsPage({ params, searchParams }: Props) {
	const resolvedParams = await params;
	const resolvedSearchParams = searchParams ? await searchParams : undefined;
	const returnTo = typeof resolvedSearchParams?.returnTo === "string" && resolvedSearchParams.returnTo.startsWith("/dashboard")
		? resolvedSearchParams.returnTo
		: "/dashboard/projects";

	redirect(`/dashboard/projects?task=${encodeURIComponent(resolvedParams.id)}&returnTo=${encodeURIComponent(returnTo)}`);
}
