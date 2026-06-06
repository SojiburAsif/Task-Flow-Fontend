export type NotificationActor = {
	id: string;
	name?: string | null;
	email?: string | null;
	image?: string | null;
	role?: string | null;
};

export type NotificationProject = {
	id: string;
	name?: string | null;
};

export type NotificationTask = {
	id: string;
	title?: string | null;
	status?: string | null;
};

export type NotificationRecord = {
	id: string;
	type: string;
	title: string;
	message: string;
	isRead: boolean;
	createdAt: string;
	actor?: NotificationActor | null;
	project?: NotificationProject | null;
	task?: NotificationTask | null;
};
