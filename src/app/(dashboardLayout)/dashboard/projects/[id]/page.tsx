import React from "react";
import { redirect } from "next/navigation";

type Props = {
	params: Promise<{ id: string }>;
};


export default async function ProjectDetailsPage({ params }: Props) {
	const { id } = await params;
	redirect(`/dashboard/projects?view=${id}`);
}