export const Role = {
    ADMIN: "Admin",
    ProjectManager: "ProjectManager",
    TeamMember: "TeamMember"
}

export type RoleType = typeof Role[keyof typeof Role];